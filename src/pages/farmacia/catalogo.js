// Catálogo simulado de productos y lotes para el recorrido de venta.
// Hoy = 2026-05-24 (según el contexto del proyecto) para evaluar vencimientos.
export const HOY = new Date('2026-05-24')

export const catalogo = [
  {
    id: 'paracetamol',
    nombre: 'Paracetamol 500 mg',
    requiereReceta: false,
    lotes: [
      { codigo: 'PAR-001', vence: '2026-06-10', stock: 20, alerta: null },
      { codigo: 'PAR-002', vence: '2026-12-01', stock: 50, alerta: null },
    ],
  },
  {
    id: 'amoxicilina',
    nombre: 'Amoxicilina 500 mg',
    requiereReceta: true,
    lotes: [
      { codigo: 'AMX-101', vence: '2026-05-01', stock: 15, alerta: null }, // vencido
      { codigo: 'AMX-102', vence: '2027-01-15', stock: 30, alerta: null },
    ],
  },
  {
    id: 'ibuprofeno',
    nombre: 'Ibuprofeno 400 mg',
    requiereReceta: false,
    lotes: [
      { codigo: 'IBU-201', vence: '2026-07-01', stock: 25, alerta: 'Retiro sanitario ISP' }, // alerta
      { codigo: 'IBU-202', vence: '2026-09-01', stock: 40, alerta: null },
    ],
  },
  {
    id: 'loratadina',
    nombre: 'Loratadina 10 mg',
    requiereReceta: false,
    lotes: [
      { codigo: 'LOR-301', vence: '2026-08-01', stock: 0, alerta: null }, // sin stock
    ],
  },
]

export function estaVencido(lote) {
  return new Date(lote.vence) < HOY
}

export function hayStock(producto) {
  return producto.lotes.some((l) => l.stock > 0)
}

// FEFO (First Expired, First Out): ordena por vencimiento ascendente y descarta
// lotes vencidos, con alerta sanitaria o sin stock.
// Devuelve { sugerido, descartados }, donde cada descartado incluye su motivo.
export function seleccionarLoteFEFO(producto) {
  const ordenados = [...producto.lotes].sort(
    (a, b) => new Date(a.vence) - new Date(b.vence),
  )
  const descartados = []
  let sugerido = null
  for (const lote of ordenados) {
    if (lote.stock <= 0) {
      descartados.push({ ...lote, motivo: 'Sin stock' })
    } else if (estaVencido(lote)) {
      descartados.push({ ...lote, motivo: 'Lote vencido' })
    } else if (lote.alerta) {
      descartados.push({ ...lote, motivo: `Alerta sanitaria: ${lote.alerta}` })
    } else {
      sugerido = lote
      break
    }
  }
  return { sugerido, descartados }
}
