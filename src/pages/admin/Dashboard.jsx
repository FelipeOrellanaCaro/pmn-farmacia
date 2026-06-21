import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      try {
        const consulta = (tabla) =>
          supabase.from(tabla).select('*', { count: 'exact', head: true })
        const [p, l, v] = await Promise.all([
          consulta('productos'),
          consulta('lotes'),
          consulta('ventas'),
        ])
        if (cancelado) return
        const err = p.error || l.error || v.error
        if (err) throw new Error(err.message)
        setStats({ productos: p.count ?? 0, lotes: l.count ?? 0, ventas: v.count ?? 0 })
      } catch (e) {
        if (!cancelado) setError(e.message)
      }
    }
    cargar()
    return () => {
      cancelado = true
    }
  }, [])

  return (
    <div className="page">
      <Link to="/admin" className="back-link">← Volver</Link>

      <div className="panel">
        <h2>📊 Dashboard</h2>

        {!stats && !error && (
          <p className="muted">Cargando estadísticas…</p>
        )}

        {error && (
          <div className="alert warning">
            No se pudo cargar el dashboard: {error}
          </div>
        )}

        {stats && (
          <div className="roles">
            <Link to="/admin/productos" className="role-card">
              <span className="icon">💊</span>
              <h2>{stats.productos}</h2>
              <p>Productos</p>
              <span className="cta">Ver detalle →</span>
            </Link>
            <Link to="/bodega/inventario" className="role-card">
              <span className="icon">📦</span>
              <h2>{stats.lotes}</h2>
              <p>Lotes</p>
              <span className="cta">Ver detalle →</span>
            </Link>
            <Link to="/admin/ventas" className="role-card">
              <span className="icon">🧾</span>
              <h2>{stats.ventas}</h2>
              <p>Ventas</p>
              <span className="cta">Ver detalle →</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
