import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Inventario() {
  const [lotes, setLotes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      const { data, error } = await supabase
        .from('lotes')
        .select('*, productos(nombre)')
        .order('id', { ascending: false })
      if (cancelado) return
      if (error) setError(error.message)
      else setLotes(data || [])
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
        <h2>📦 Inventario</h2>

        {cargando && <p className="muted">Cargando inventario…</p>}

        {error && (
          <div className="alert warning">
            No se pudo cargar el inventario: {error}
          </div>
        )}

        {!cargando && !error && lotes.length === 0 && (
          <p className="muted">No hay lotes registrados.</p>
        )}

        {lotes.map((lote) => (
          <div key={lote.id} className="lote-card">
            <h4>{lote.productos?.nombre}</h4>
            <p>Lote: {lote.numero_lote}</p>
            <p>Stock: {lote.cantidad_actual}</p>
            <p>Vence: {lote.fecha_vencimiento}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
