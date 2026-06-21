// Catálogo simulado de productos y lotes para el recorrido de venta.
// Las fechas se evalúan contra la fecha real del sistema (no una fecha fija),
// de modo que los vencimientos reflejan el calendario actual al momento de la demo.
export const HOY = new Date()

export const catalogo = [
  {
    id: 'paracetamol',
    nombre: 'Paracetamol 500 mg',
    requiereReceta: false,
    lotes: [
      // Camino feliz: ambos lotes vigentes. FEFO elige el que vence primero.
      { codigo: 'PAR-001', vence: '2026-09-15', stock: 20, alerta: null },
      { codigo: 'PAR-002', vence: '2027-03-01', stock: 50, alerta: null },
    ],
  },
  {
    id: 'amoxicilina',
    nombre: 'Amoxicilina 500 mg',
    requiereReceta: true,
    lotes: [
      // Demuestra descarte por vencimiento + activa validación de receta.
      { codigo: 'AMX-101', vence: '2026-04-10', stock: 15, alerta: null }, // vencido
      { codigo: 'AMX-102', vence: '2027-02-15', stock: 30, alerta: null },
    ],
  },
  {
    id: 'ibuprofeno',
    nombre: 'Ibuprofeno 400 mg',
    requiereReceta: false,
    lotes: [
      // Demuestra descarte por alerta sanitaria (lote vigente pero retirado).
      { codigo: 'IBU-201', vence: '2026-10-01', stock: 25, alerta: 'Retiro sanitario ISP' },
      { codigo: 'IBU-202', vence: '2026-12-15', stock: 40, alerta: null },
    ],
  },
  {
    id: 'loratadina',
    nombre: 'Loratadina 10 mg',
    requiereReceta: false,
    lotes: [
      // Demuestra el caso "sin stock".
      { codigo: 'LOR-301', vence: '2026-11-01', stock: 0, alerta: null },
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
