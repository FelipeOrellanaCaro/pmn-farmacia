import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import Stepper from './Stepper'
import PasoRegistro from './pasos/PasoRegistro'
import PasoValidacion from './pasos/PasoValidacion'
import PasoStock from './pasos/PasoStock'
import PasoEstado from './pasos/PasoEstado'
import PasoInventario from './pasos/PasoInventario'
import Resultado from './pasos/Resultado'

import { supabase } from '../../lib/supabase'

const ESTADO_INICIAL = {
  paso: 'registro',
  lote: {
    medicamento: '',
    proveedor: '',
    cantidad: '',
    vencimiento: '',
  },
  exceso: false,
  cargando: false,
  fin: null,
}

export default function BodegaReg() {
  const [bodega, setBodega] = useState(ESTADO_INICIAL)
  const guardarRef = useRef(false) // guarda anti doble-click sincrónica

  const set = (patch) => setBodega((v) => ({ ...v, ...patch }))

  // PASO 1
  const registrarLote = (datos) => {
    if (
      !datos.medicamento ||
      !datos.proveedor ||
      !datos.cantidad ||
      !datos.vencimiento
    ) {
      set({
        paso: 'resultado',
        fin: {
          ok: false,
          titulo: 'Lote rechazado',
          detalle: 'Faltan datos obligatorios.',
        },
      })
      return
    }
    set({ lote: datos, paso: 'validacion' })
  }

  // PASO 2
  const validarDatos = () => {
    const exceso = Number(bodega.lote.cantidad) > 500
    set({ exceso, paso: exceso ? 'stock' : 'estado' })
  }

  // PASO 3
  const continuarStock = () => set({ paso: 'estado' })

  // PASO 4
  const actualizarEstado = () => set({ paso: 'inventario' })

  // PASO 5 — escribe en Supabase
  const registrarInventario = async () => {
    if (guardarRef.current) return // evita doble registro por doble-click
    guardarRef.current = true
    set({ cargando: true })

    try {
      const { data: producto, error: errorProducto } = await supabase
        .from('productos')
        .select('*')
        .eq('nombre', bodega.lote.medicamento)
        .single()
      if (errorProducto || !producto) throw new Error('Producto no encontrado')

      const { data: proveedor, error: errorProveedor } = await supabase
        .from('proveedores')
        .select('*')
        .eq('nombre', bodega.lote.proveedor)
        .single()
      if (errorProveedor || !proveedor) throw new Error('Proveedor no encontrado')

      const { data: lote, error: errorLote } = await supabase
        .from('lotes')
        .insert([
          {
            producto_id: producto.id,
            proveedor_id: proveedor.id,
            numero_lote: 'LOT-' + Date.now(),
            fecha_vencimiento: bodega.lote.vencimiento,
            cantidad_inicial: Number(bodega.lote.cantidad),
            cantidad_actual: Number(bodega.lote.cantidad),
            estado: 'almacenado',
            ingresado_por: 1,
          },
        ])
        .select()
        .single()
      if (errorLote) throw errorLote

      const { error: errorTrazabilidad } = await supabase
        .from('trazabilidad')
        .insert([
          {
            lote_id: lote.id,
            usuario_id: 1,
            accion: 'registro_lote',
            descripcion: 'Registro de lote desde el sistema',
            estado_nuevo: 'almacenado',
          },
        ])
      if (errorTrazabilidad) throw errorTrazabilidad

      set({
        cargando: false,
        paso: 'resultado',
        fin: {
          ok: true,
          titulo: 'Lote registrado',
          detalle: 'El lote fue almacenado y registrado en el sistema.',
          numeroLote: lote.numero_lote,
          medicamento: bodega.lote.medicamento,
          proveedor: bodega.lote.proveedor,
          cantidad: bodega.lote.cantidad,
          fecha: new Date().toLocaleString('es-CL'),
        },
      })
    } catch (error) {
      set({
        cargando: false,
        paso: 'resultado',
        fin: {
          ok: false,
          titulo: 'Error',
          detalle: error.message || 'No fue posible registrar el lote.',
        },
      })
    } finally {
      guardarRef.current = false
    }
  }

  const reiniciar = () => {
    guardarRef.current = false
    setBodega(ESTADO_INICIAL)
  }

  const render = () => {
    switch (bodega.paso) {
      case 'registro':
        return <PasoRegistro onContinuar={registrarLote} />
      case 'validacion':
        return <PasoValidacion lote={bodega.lote} onContinuar={validarDatos} />
      case 'stock':
        return <PasoStock lote={bodega.lote} onContinuar={continuarStock} />
      case 'estado':
        return <PasoEstado onContinuar={actualizarEstado} />
      case 'inventario':
        return <PasoInventario onContinuar={registrarInventario} cargando={bodega.cargando} />
      case 'resultado':
        return <Resultado fin={bodega.fin} onReiniciar={reiniciar} />
      default:
        return null
    }
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">← Volver al inicio</Link>

      <div className="panel">
        <h2>📦 Encargado de bodega</h2>
        <p className="subtitle">Flujo BPMN de recepción y validación de lotes</p>

        {bodega.paso !== 'resultado' && <Stepper pasoActual={bodega.paso} />}

        {render()}
      </div>
    </div>
  )
}
