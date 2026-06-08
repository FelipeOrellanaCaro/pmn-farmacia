import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Trazabilidad() {

  const [datos, setDatos] =
    useState([])

  useEffect(() => {
    cargar()
  }, [])

  const cargar = async () => {

    const { data } =
      await supabase
        .from('trazabilidad')
        .select('*')
        .order(
          'id',
          {
            ascending: false
          }
        )

    setDatos(data || [])
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
          📜 Trazabilidad
        </h2>

        {datos.map(
          t => (

            <div
              key={t.id}
              className="lote-card"
            >

              <h4>
                {t.accion}
              </h4>

              <p>
                {t.descripcion}
              </p>

              <p>
                Lote:
                {' '}
                {t.lote_id}
              </p>

            </div>

          )
        )}

      </div>

    </div>
  )
}