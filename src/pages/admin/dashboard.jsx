import { useEffect, useState }
from 'react'

import { supabase }
from '../../lib/supabase'

export default function Dashboard() {

  const [stats,
  setStats] =
  useState({})

  useEffect(() => {

    cargar()

  }, [])

  const cargar =
  async () => {

    const {
      count: productos
    } =
    await supabase
      .from('productos')
      .select(
        '*',
        {
          count: 'exact',
          head: true
        }
      )

    const {
      count: lotes
    } =
    await supabase
      .from('lotes')
      .select(
        '*',
        {
          count: 'exact',
          head: true
        }
      )

    const {
      count: ventas
    } =
    await supabase
      .from('ventas')
      .select(
        '*',
        {
          count: 'exact',
          head: true
        }
      )

    setStats({
      productos,
      lotes,
      ventas
    })
  }

  return (

    <div className="page">

      <div className="panel">

        <h2>
          📊 Dashboard
        </h2>

        <div
          className="roles"
        >

          <div
            className="role-card"
          >
            Productos:
            {' '}
            {
              stats.productos
            }
          </div>

          <div
            className="role-card"
          >
            Lotes:
            {' '}
            {
              stats.lotes
            }
          </div>

          <div
            className="role-card"
          >
            Ventas:
            {' '}
            {
              stats.ventas
            }
          </div>

        </div>

      </div>

    </div>
  )
}