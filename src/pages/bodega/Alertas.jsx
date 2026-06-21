import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Alertas() {
  const [alertas, setAlertas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      const { data, error } = await supabase.from('alertas').select('*')
      if (cancelado) return
      if (error) setError(error.message)
      else setAlertas(data || [])
      setCargando(false)
    }
    cargar()
    return () => {
      cancelado = true
    }
  }, [])

  return (
    <div className="page">
      <Link to="/bodega" className="back-link">← Volver</Link>

      <div className="panel">
        <h2>⚠️ Alertas</h2>

        {cargando && <p className="muted">Cargando alertas…</p>}

        {error && (
          <div className="alert warning">
            No se pudo cargar las alertas: {error}
          </div>
        )}

        {!cargando && !error && alertas.length === 0 && (
          <p className="muted">No hay alertas activas.</p>
        )}

        {alertas.map((a) => (
          <div key={a.id} className="alert warning">
            <strong>{a.tipo_alerta}</strong>
            <p>{a.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
