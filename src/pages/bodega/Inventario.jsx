import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Inventario() {

  const [lotes, setLotes] =
    useState([])

  useEffect(() => {
    cargar()
  }, [])

  const cargar = async () => {

    const { data } =
      await supabase
        .from('lotes')
        .select(`
          *,
          productos(nombre)
        `)
        .order(
          'id',
          {
            ascending: false
          }
        )

    setLotes(data || [])
  }

  return (

    <div className="page">

      <Link
        to="/bodega"
        className="back-link"
      >
        ← Volver
      </Link>

      <div className="panel">

        <h2>
          📦 Inventario
        </h2>

        {lotes.map(
          lote => (

            <div
              key={lote.id}
              className="lote-card"
            >

              <h4>
                {
                  lote.productos
                    ?.nombre
                }
              </h4>

              <p>
                Lote:
                {' '}
                {lote.numero_lote}
              </p>

              <p>
                Stock:
                {' '}
                {lote.cantidad_actual}
              </p>

              <p>
                Vence:
                {' '}
                {
                  lote.fecha_vencimiento
                }
              </p>

            </div>

          )
        )}

      </div>

    </div>
  )
}