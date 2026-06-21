import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Trazabilidad() {
  const [datos, setDatos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      const { data, error } = await supabase
        .from('trazabilidad')
        .select('*')
        .order('id', { ascending: false })
      if (cancelado) return
      if (error) setError(error.message)
      else setDatos(data || [])
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
        <h2>📜 Trazabilidad</h2>

        {cargando && <p className="muted">Cargando trazabilidad…</p>}

        {error && (
          <div className="alert warning">
            No se pudo cargar la trazabilidad: {error}
          </div>
        )}

        {!cargando && !error && datos.length === 0 && (
          <p className="muted">No hay eventos de trazabilidad.</p>
        )}

        {datos.map((t) => (
          <div key={t.id} className="lote-card">
            <h4>{t.accion}</h4>
            <p>{t.descripcion}</p>
            <p>Lote: {t.lote_id}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
