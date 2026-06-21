import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Alertas() {

  const [alertas,
  setAlertas] =
  useState([])

  useEffect(() => {
    cargar()
  }, [])

  const cargar = async () => {

    const { data } =
      await supabase
        .from('alertas')
        .select('*')

    setAlertas(data || [])
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
          ⚠️ Alertas
        </h2>

        {

          alertas.map(
            a => (

              <div
                key={a.id}
                className="alert warning"
              >

                <strong>
                  {
                    a.tipo_alerta
                  }
                </strong>

                <p>
                  {
                    a.descripcion
                  }
                </p>

              </div>

            )
          )

        }

      </div>

    </div>
  )
}