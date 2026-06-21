// Catálogo de productos y lotes para el recorrido de venta.
// Ahora consulta Supabase en lugar de usar datos hardcodeados, de modo que
// Bodega, Farmacia y Administrador comparten el mismo origen de datos.
import { supabase } from '../../lib/supabase'

// Carga la lista de productos disponibles para la venta.
export async function cargarProductos() {
  const { data, error } = await supabase
    .from('productos')
    .select('id, nombre, requiere_receta')
    .order('nombre')
  if (error) throw new Error(error.message)
  return (data || []).map((p) => ({
    id: p.id,
    nombre: p.nombre,
    requiereReceta: p.requiere_receta,
  }))
}

// Mapea un lote de la BD al formato que los pasos del wizard ya conocen
// (codigo, vence, stock), conservando el id para escrituras posteriores.
function mapLote(l) {
  return {
    id: l.id,
    codigo: l.numero_lote,
    vence: l.fecha_vencimiento,
    stock: l.cantidad_actual,
  }
}

function estaVencido(lote) {
  return new Date(lote.vence) < new Date()
}

// FEFO (First Expired, First Out): consulta los lotes y alertas del producto
// y descarta los que tienen problema (sin stock, vencidos, con alerta),
// devolviendo el lote sugerido y la lista de descartados con el motivo.
export async function seleccionarLoteFEFO(productoId) {
  const { data: lotes, error } = await supabase
    .from('lotes')
    .select('id, numero_lote, fecha_vencimiento, cantidad_actual')
    .eq('producto_id', productoId)
    .order('fecha_vencimiento', { ascending: true })
  if (error) throw new Error(error.message)

  // Carga las alertas sanitarias relacionadas: aplican a un lote específico
  // o al producto completo (lote_id null).
  const loteIds = (lotes || []).map((l) => l.id)
  let alertas = []
  const { data: alertasData, error: errorAlertas } = loteIds.length
    ? await supabase
        .from('alertas')
        .select('lote_id, producto_id, descripcion')
        .or(`producto_id.eq.${productoId},lote_id.in.(${loteIds.join(',')})`)
    : { data: [], error: null }
  if (errorAlertas) throw new Error(errorAlertas.message)
  alertas = alertasData || []

  const alertaDeLote = (loteId) =>
    alertas.find(
      (a) =>
        a.lote_id === loteId ||
        (a.lote_id == null && a.producto_id === productoId),
    )

  const descartados = []
  let sugerido = null
  for (const lote of lotes || []) {
    const m = mapLote(lote)
    if (m.stock <= 0) {
      descartados.push({ ...m, motivo: 'Sin stock' })
      continue
    }
    if (estaVencido(m)) {
      descartados.push({ ...m, motivo: 'Lote vencido' })
      continue
    }
    const a = alertaDeLote(lote.id)
    if (a) {
      descartados.push({ ...m, motivo: `Alerta sanitaria: ${a.descripcion}` })
      continue
    }
    sugerido = m
    break
  }
  return { sugerido, descartados }
}

// Busca otro lote válido (vigente, con stock, sin alerta) del mismo producto,
// distinto al sugerido. Usado para simular el caso de "discrepancia leve"
// donde el auxiliar escaneó un lote físico distinto pero válido.
export async function buscarLoteAlternativo(productoId, loteSugeridoId) {
  const { sugerido, descartados } = await seleccionarLoteFEFO(productoId)
  // Aprovecha el orden FEFO para tomar el siguiente vigente distinto al sugerido.
  if (sugerido && sugerido.id !== loteSugeridoId) return sugerido
  const { data: otros, error } = await supabase
    .from('lotes')
    .select('id, numero_lote, fecha_vencimiento, cantidad_actual')
    .eq('producto_id', productoId)
    .neq('id', loteSugeridoId)
    .gt('cantidad_actual', 0)
    .order('fecha_vencimiento', { ascending: true })
  if (error || !otros || otros.length === 0) return null
  const valido = otros.find((l) => new Date(l.fecha_vencimiento) >= new Date())
  return valido ? mapLote(valido) : null
}
