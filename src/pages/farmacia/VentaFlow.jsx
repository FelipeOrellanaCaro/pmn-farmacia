import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { seleccionarLoteFEFO, buscarLoteAlternativo } from './catalogo'
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
  loteFisico: null,
  discrepancia: null,
  cargando: false,
  fin: null,
}

export default function VentaFlow() {
  const [venta, setVenta] = useState(ESTADO_INICIAL)
  const guardarRef = useRef(false)

  const set = (patch) => setVenta((v) => ({ ...v, ...patch }))
  const reset = () => {
    guardarRef.current = false
    setVenta(ESTADO_INICIAL)
  }

  // 1. Producto → consulta stock y aplica FEFO contra la BD
  const elegirProducto = async (producto, cantidad) => {
    set({ producto, cantidad, cargando: true })
    try {
      const { sugerido, descartados } = await seleccionarLoteFEFO(producto.id)
      if (!sugerido) {
        const sinLotes = descartados.length === 0
        const todosSinStock =
          descartados.length > 0 && descartados.every((d) => d.motivo === 'Sin stock')
        const fin =
          sinLotes || todosSinStock
            ? {
                ok: false,
                titulo: 'Sin stock',
                detalle: `No hay stock disponible de ${producto.nombre}.`,
              }
            : {
                ok: false,
                titulo: 'Venta bloqueada',
                detalle: 'Todos los lotes están vencidos o con alerta sanitaria.',
              }
        set({ cargando: false, descartados, paso: 'resultado', fin })
        return
      }
      set({
        cargando: false,
        loteSugerido: sugerido,
        descartados,
        paso: 'lote',
      })
    } catch (e) {
      set({
        cargando: false,
        paso: 'resultado',
        fin: { ok: false, titulo: 'Error', detalle: e.message },
      })
    }
  }

  // 2. Lote → deriva a receta o escaneo
  const confirmarLote = () =>
    set({ paso: venta.producto.requiereReceta ? 'receta' : 'escaneo' })

  // 3. Receta (condicional)
  const validarReceta = (valida) => {
    if (!valida) {
      set({
        paso: 'resultado',
        fin: {
          ok: false,
          titulo: 'Venta sin receta válida',
          detalle: 'La receta no es válida o está vencida.',
        },
      })
      return
    }
    set({ paso: 'escaneo' })
  }

  // 4. Escaneo
  const escanearCorrecto = () =>
    set({ loteFisico: venta.loteSugerido, discrepancia: null, paso: 'confirmar' })

  const escanearGrave = () =>
    set({
      paso: 'resultado',
      fin: {
        ok: false,
        titulo: 'Venta bloqueada por riesgo',
        detalle: 'El lote escaneado no es vendible. Se forzó su envío a cuarentena.',
      },
    })

  const resolverLeve = async (usar) => {
    if (!usar) {
      set({
        paso: 'resultado',
        fin: {
          ok: false,
          titulo: 'Venta cancelada',
          detalle: 'Se canceló la venta por no usar el lote físico distinto.',
        },
      })
      return
    }
    set({ cargando: true })
    try {
      const alt = await buscarLoteAlternativo(venta.producto.id, venta.loteSugerido.id)
      // Si no hay alternativo real, usamos el sugerido y solo registramos la discrepancia.
      set({
        cargando: false,
        loteFisico: alt || venta.loteSugerido,
        discrepancia: 'leve',
        paso: 'confirmar',
      })
    } catch (e) {
      set({
        cargando: false,
        loteFisico: venta.loteSugerido,
        discrepancia: 'leve',
        paso: 'confirmar',
      })
    }
  }

  // 5. Concretar venta → escribe en BD (ventas + decrement lote + trazabilidad)
  const concretar = async () => {
    if (guardarRef.current) return
    guardarRef.current = true
    set({ cargando: true })

    const loteUsado = venta.loteFisico || venta.loteSugerido
    try {
      // Insertar venta
      const { data: ventaCreada, error: errorVenta } = await supabase
        .from('ventas')
        .insert([
          {
            lote_id: loteUsado.id,
            cantidad: Number(venta.cantidad),
            realizada_por: 1,
            receta_validada: !!venta.producto.requiereReceta,
            discrepancia: venta.discrepancia === 'leve' ? 'leve' : 'ninguna',
          },
        ])
        .select()
        .single()
      if (errorVenta) throw new Error(errorVenta.message)

      // Decrement stock del lote
      const nuevoStock = Math.max(0, loteUsado.stock - Number(venta.cantidad))
      const { error: errorLote } = await supabase
        .from('lotes')
        .update({ cantidad_actual: nuevoStock })
        .eq('id', loteUsado.id)
      if (errorLote) throw new Error(errorLote.message)

      // Registrar evento en trazabilidad
      await supabase.from('trazabilidad').insert([
        {
          lote_id: loteUsado.id,
          usuario_id: 1,
          accion: 'venta',
          descripcion: `Venta de ${venta.cantidad} unidad(es) de ${venta.producto.nombre}`,
          estado_nuevo: nuevoStock === 0 ? 'agotado' : 'almacenado',
        },
      ])

      set({
        cargando: false,
        paso: 'resultado',
        fin: {
          ok: true,
          titulo: 'Venta exitosa',
          detalle: 'La venta se concretó y el stock fue actualizado en la base de datos.',
          ventaId: `V-${String(ventaCreada.id).padStart(6, '0')}`,
          timestamp: new Date().toLocaleString('es-CL'),
        },
      })
    } catch (e) {
      set({
        cargando: false,
        paso: 'resultado',
        fin: {
          ok: false,
          titulo: 'Error al concretar venta',
          detalle: e.message,
        },
      })
    } finally {
      guardarRef.current = false
    }
  }

  const render = () => {
    if (venta.cargando && venta.paso !== 'resultado') {
      return <p className="muted">Procesando…</p>
    }
    switch (venta.paso) {
      case 'producto':
        return <PasoProducto venta={venta} onContinuar={elegirProducto} />
      case 'lote':
        return <PasoLote venta={venta} onContinuar={confirmarLote} />
      case 'receta':
        return <PasoReceta venta={venta} onValidar={validarReceta} />
      case 'escaneo':
        return (
          <PasoEscaneo
            venta={venta}
            onCorrecto={escanearCorrecto}
            onLeve={resolverLeve}
            onGrave={escanearGrave}
          />
        )
      case 'confirmar':
        return <PasoConfirmar venta={venta} onConcretar={concretar} cargando={venta.cargando} />
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
        <p className="subtitle">Recorrido con selección de lote por FEFO conectado a Supabase</p>

        {venta.paso !== 'resultado' && (
          <Stepper pasoActual={venta.paso} requiereReceta={venta.producto?.requiereReceta} />
        )}

        {render()}
      </div>
    </div>
  )
}
