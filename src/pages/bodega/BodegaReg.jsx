import { useState } from 'react'
import { Link } from 'react-router-dom'

import Stepper from './Stepper'

import PasoRegistro from './pasos/PasoRegistro'
import PasoValidacion from './pasos/PasoValidacion'
import PasoStock from './pasos/PasoStock'
import PasoEstado from './pasos/PasoEstado'
import PasoInventario from './pasos/PasoInventario'
import Resultado from './pasos/Resultado'
import { guardarLote } from '../../data/lotesStorage'

const ESTADO_INICIAL = {
  paso: 'registro',

  lote: {
    medicamento: '',
    proveedor: '',
    cantidad: '',
    vencimiento: '',
  },

  exceso: false,

  fin: null,
}

export default function BodegaReg() {

  const [bodega, setBodega] = useState(ESTADO_INICIAL)

  const set = (patch) =>
    setBodega((v) => ({ ...v, ...patch }))

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

    set({
      lote: datos,
      paso: 'validacion',
    })
  }

  // PASO 2
  const validarDatos = () => {

    const exceso = Number(bodega.lote.cantidad) > 500

    set({
      exceso,
      paso: exceso ? 'stock' : 'estado',
    })
  }

  // PASO 3
  const continuarStock = () => {
    set({ paso: 'estado' })
  }

  // PASO 4
  const actualizarEstado = () => {
    guardarLote({
        medicamento: bodega.lote.medicamento,
        proveedor: bodega.lote.proveedor,
        cantidad: bodega.lote.cantidad,
        vencimiento: bodega.lote.vencimiento,
        estado: 'Disponible',
    })

    set({
        paso: 'resultado',

        fin: {
        ok: true,
        titulo: 'Lote registrado',
        detalle: 'El lote fue almacenado y registrado correctamente.',
        },
    })
  }

  const reiniciar = () => {
    setBodega(ESTADO_INICIAL)
  }

  const render = () => {

    switch (bodega.paso) {

      case 'registro':
        return (
          <PasoRegistro onContinuar={registrarLote} />
        )

      case 'validacion':
        return (
          <PasoValidacion
            lote={bodega.lote}
            onContinuar={validarDatos}
          />
        )

      case 'stock':
        return (
          <PasoStock
            lote={bodega.lote}
            onContinuar={continuarStock}
          />
        )

      case 'estado':
        return (
          <PasoEstado
            onContinuar={actualizarEstado}
          />
        )

      case 'inventario':
        return (
          <PasoInventario
            onContinuar={registrarInventario}
          />
        )

      case 'resultado':
        return (
          <Resultado
            fin={bodega.fin}
            onReiniciar={reiniciar}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="page">

      <Link to="/" className="back-link">
        ← Volver al inicio
      </Link>

      <div className="panel">

        <h2>📦 Encargado de bodega</h2>

        <p className="subtitle">
          Flujo BPMN de recepción y validación de lotes
        </p>

        {bodega.paso !== 'resultado' && (
          <Stepper pasoActual={bodega.paso} />
        )}

        {render()}

      </div>
    </div>
  )
}