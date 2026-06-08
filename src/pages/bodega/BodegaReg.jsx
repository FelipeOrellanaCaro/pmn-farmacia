import { useState } from 'react'
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

  fin: null,
}

export default function BodegaReg() {

  const [bodega, setBodega] =
    useState(ESTADO_INICIAL)

  const set = (patch) =>
    setBodega((v) => ({
      ...v,
      ...patch,
    }))

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
          detalle:
            'Faltan datos obligatorios.',
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

    const exceso =
      Number(
        bodega.lote.cantidad
      ) > 500

    set({
      exceso,
      paso: exceso
        ? 'stock'
        : 'estado',
    })
  }

  // PASO 3
  const continuarStock = () => {

    set({
      paso: 'estado',
    })
  }

  // PASO 4
  const actualizarEstado = () => {

    set({
      paso: 'inventario',
    })
  }

  // PASO 5
  const registrarInventario = async () => {

    console.log('====================')
    console.log('PASO 5 EJECUTADO')
    console.log('DATOS DEL LOTE:')
    console.log(bodega.lote)
    console.log('====================')

    try {

      console.log('Buscando producto...')

      const {
        data: producto,
        error: errorProducto
      } = await supabase
        .from('productos')
        .select('*')
        .eq(
          'nombre',
          bodega.lote.medicamento
        )
        .single()

      console.log('PRODUCTO:')
      console.log(producto)
      console.log('ERROR PRODUCTO:')
      console.log(errorProducto)

      if (
        errorProducto ||
        !producto
      ) {

        throw new Error(
          'Producto no encontrado'
        )
      }

      console.log('Buscando proveedor...')

      const {
        data: proveedor,
        error: errorProveedor
      } = await supabase
        .from('proveedores')
        .select('*')
        .eq(
          'nombre',
          bodega.lote.proveedor
        )
        .single()

      console.log('PROVEEDOR:')
      console.log(proveedor)
      console.log('ERROR PROVEEDOR:')
      console.log(errorProveedor)

      if (
        errorProveedor ||
        !proveedor
      ) {

        throw new Error(
          'Proveedor no encontrado'
        )
      }

      console.log('Insertando lote...')

      const {
        data: lote,
        error: errorLote
      } = await supabase
        .from('lotes')
        .insert([
          {
            producto_id:
              producto.id,

            proveedor_id:
              proveedor.id,

            numero_lote:
              'LOT-' +
              Date.now(),

            fecha_vencimiento:
              bodega.lote.vencimiento,

            cantidad_inicial:
              Number(
                bodega.lote.cantidad
              ),

            cantidad_actual:
              Number(
                bodega.lote.cantidad
              ),

            estado:
              'almacenado',

            ingresado_por: 1,
          },
        ])
        .select()
        .single()

      console.log('LOTE:')
      console.log(lote)
      console.log('ERROR LOTE:')
      console.log(errorLote)

      if (errorLote)
        throw errorLote

      console.log(
        'Insertando trazabilidad...'
      )

      const {
        error: errorTrazabilidad
      } = await supabase
        .from('trazabilidad')
        .insert([
          {
            lote_id:
              lote.id,

            usuario_id: 1,

            accion:
              'registro_lote',

            descripcion:
              'Registro desde PMV',

            estado_nuevo:
              'almacenado',
          },
        ])

      console.log(
        'ERROR TRAZABILIDAD:'
      )
      console.log(
        errorTrazabilidad
      )

      if (
        errorTrazabilidad
      )
        throw errorTrazabilidad

      console.log(
        'REGISTRO COMPLETADO'
      )

      set({
        paso: 'resultado',

        fin: {
          ok: true,

          titulo:
            'Lote registrado',

          detalle:
            'El lote fue almacenado y registrado correctamente en Supabase.',
        },
      })

    } catch (error) {

      console.error(
        'ERROR COMPLETO:'
      )

      console.error(error)

      set({
        paso: 'resultado',

        fin: {
          ok: false,

          titulo:
            'Error',

          detalle:
            error.message ||
            'No fue posible registrar el lote.',
        },
      })
    }
  }
  const reiniciar = () => {

    setBodega(
      ESTADO_INICIAL
    )
  }

  const render = () => {

    switch (
      bodega.paso
    ) {

      case 'registro':
        return (
          <PasoRegistro
            onContinuar={
              registrarLote
            }
          />
        )

      case 'validacion':
        return (
          <PasoValidacion
            lote={
              bodega.lote
            }
            onContinuar={
              validarDatos
            }
          />
        )

      case 'stock':
        return (
          <PasoStock
            lote={
              bodega.lote
            }
            onContinuar={
              continuarStock
            }
          />
        )

      case 'estado':
        return (
          <PasoEstado
            onContinuar={
              actualizarEstado
            }
          />
        )

      case 'inventario':
        return (
          <PasoInventario
            onContinuar={
              registrarInventario
            }
          />
        )

      case 'resultado':
        return (
          <Resultado
            fin={bodega.fin}
            onReiniciar={
              reiniciar
            }
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="page">

      <Link
        to="/"
        className="back-link"
      >
        ← Volver al inicio
      </Link>

      <div className="panel">

        <h2>
          📦 Encargado de bodega
        </h2>

        <p className="subtitle">
          Flujo BPMN de recepción y validación de lotes
        </p>

        {bodega.paso !==
          'resultado' && (
          <Stepper
            pasoActual={
              bodega.paso
            }
          />
        )}

        {render()}

      </div>

    </div>
  )
}