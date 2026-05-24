import { useState } from 'react'
import { Link } from 'react-router-dom'
import { hayStock, seleccionarLoteFEFO } from './catalogo'
import Stepper from './Stepper'
import PasoProducto from './pasos/PasoProducto'
import PasoLote from './pasos/PasoLote'
import PasoReceta from './pasos/PasoReceta'
import PasoEscaneo from './pasos/PasoEscaneo'
import PasoConfirmar from './pasos/PasoConfirmar'
import Resultado from './pasos/Resultado'

const ESTADO_INICIAL = {
  paso: 'producto',
  producto: null,
  cantidad: 1,
  loteSugerido: null,
  descartados: [],
  loteFisico: null, // lote efectivamente usado (puede diferir del sugerido)
  discrepancia: null, // null | 'leve'
  fin: null, // { ok, titulo, detalle, ... }
}

export default function VentaFlow() {
  const [venta, setVenta] = useState(ESTADO_INICIAL)
  const set = (patch) => setVenta((v) => ({ ...v, ...patch }))
  const reset = () => setVenta(ESTADO_INICIAL)

  // 1. Producto -> chequea stock y aplica FEFO
  const elegirProducto = (producto, cantidad) => {
    if (!hayStock(producto)) {
      set({
        producto,
        cantidad,
        paso: 'resultado',
        fin: { ok: false, titulo: 'Sin stock', detalle: `No hay stock disponible de ${producto.nombre}.` },
      })
      return
    }
    const { sugerido, descartados } = seleccionarLoteFEFO(producto)
    if (!sugerido) {
      set({
        producto,
        cantidad,
        descartados,
        paso: 'resultado',
        fin: { ok: false, titulo: 'Venta bloqueada', detalle: 'Todos los lotes están vencidos o con alerta sanitaria.' },
      })
      return
    }
    set({ producto, cantidad, loteSugerido: sugerido, descartados, paso: 'lote' })
  }

  // 2. Lote -> deriva a receta o escaneo
  const confirmarLote = () => set({ paso: venta.producto.requiereReceta ? 'receta' : 'escaneo' })

  // 3. Receta (condicional)
  const validarReceta = (valida) => {
    if (!valida) {
      set({ paso: 'resultado', fin: { ok: false, titulo: 'Venta sin receta válida', detalle: 'La receta no es válida o está vencida.' } })
      return
    }
    set({ paso: 'escaneo' })
  }

  // 4. Escaneo físico
  const escanearCorrecto = () => set({ loteFisico: venta.loteSugerido, discrepancia: null, paso: 'confirmar' })
  const escanearGrave = () =>
    set({ paso: 'resultado', fin: { ok: false, titulo: 'Venta bloqueada por riesgo', detalle: 'El lote escaneado no es vendible. Se forzó su envío a cuarentena.' } })
  const resolverLeve = (usar) => {
    if (!usar) {
      set({ paso: 'resultado', fin: { ok: false, titulo: 'Venta cancelada', detalle: 'Se canceló la venta por no usar el lote físico distinto.' } })
      return
    }
    const alt = { codigo: 'ALT-' + venta.loteSugerido.codigo, vence: venta.loteSugerido.vence, stock: venta.loteSugerido.stock, alerta: null }
    set({ loteFisico: alt, discrepancia: 'leve', paso: 'confirmar' })
  }

  // 5. Confirmar -> concretar venta
  const concretar = () => {
    const ventaId = 'V-' + Math.floor(Math.random() * 900000 + 100000)
    set({
      paso: 'resultado',
      fin: {
        ok: true,
        titulo: 'Venta exitosa',
        detalle: 'La venta se concretó y quedó registrada en el sistema.',
        ventaId,
        timestamp: new Date().toLocaleString('es-CL'),
      },
    })
  }

  const render = () => {
    switch (venta.paso) {
      case 'producto':
        return <PasoProducto venta={venta} onContinuar={elegirProducto} />
      case 'lote':
        return <PasoLote venta={venta} onContinuar={confirmarLote} />
      case 'receta':
        return <PasoReceta venta={venta} onValidar={validarReceta} />
      case 'escaneo':
        return <PasoEscaneo venta={venta} onCorrecto={escanearCorrecto} onLeve={resolverLeve} onGrave={escanearGrave} />
      case 'confirmar':
        return <PasoConfirmar venta={venta} onConcretar={concretar} />
      case 'resultado':
        return <Resultado venta={venta} onReiniciar={reset} />
      default:
        return null
    }
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">← Volver al inicio</Link>
      <div className="panel">
        <h2>💊 Venta — Auxiliar de farmacia</h2>
        <p className="subtitle">Recorrido con selección de lote por FEFO</p>

        {venta.paso !== 'resultado' && (
          <Stepper pasoActual={venta.paso} requiereReceta={venta.producto?.requiereReceta} />
        )}

        {render()}
      </div>
    </div>
  )
}
