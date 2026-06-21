import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      const { data, error } = await supabase
        .from('productos')
        .select('id, nombre, requiere_receta, creado_en')
        .order('nombre')
      if (cancelado) return
      if (error) setError(error.message)
      else setProductos(data || [])
      setCargando(false)
    }
    cargar()
    return () => {
      cancelado = true
    }
  }, [])

  return (
    <div className="page">
      <Link to="/admin/dashboard" className="back-link">← Volver al dashboard</Link>

      <div className="panel">
        <h2>💊 Productos</h2>
        <p className="subtitle">Catálogo de medicamentos del sistema</p>

        {cargando && <p className="muted">Cargando productos…</p>}

        {error && (
          <div className="alert warning">
            No se pudieron cargar los productos: {error}
          </div>
        )}

        {!cargando && !error && productos.length === 0 && (
          <p className="muted">No hay productos registrados.</p>
        )}

        {productos.map((p) => (
          <div key={p.id} className="lote-card">
            <h4>{p.nombre}</h4>
            <p>
              {p.requiere_receta ? '🔒 Requiere receta médica' : '✓ Venta libre'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
