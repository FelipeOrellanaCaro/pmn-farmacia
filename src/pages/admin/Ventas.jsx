import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Ventas() {
  const [ventas, setVentas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelado = false
    const cargar = async () => {
      // Trae cada venta con el lote y el producto asociados (join).
      const { data, error } = await supabase
        .from('ventas')
        .select(
          'id, cantidad, discrepancia, receta_validada, creado_en, lotes(numero_lote, productos(nombre))',
        )
        .order('id', { ascending: false })
      if (cancelado) return
      if (error) setError(error.message)
      else setVentas(data || [])
      setCargando(false)
    }
    cargar()
    return () => {
      cancelado = true
    }
  }, [])

  const formatear = (iso) => new Date(iso).toLocaleString('es-CL')

  return (
    <div className="page">
      <Link to="/admin/dashboard" className="back-link">← Volver al dashboard</Link>

      <div className="panel">
        <h2>🧾 Ventas</h2>
        <p className="subtitle">Historial completo de ventas concretadas</p>

        {cargando && <p className="muted">Cargando ventas…</p>}

        {error && (
          <div className="alert warning">
            No se pudieron cargar las ventas: {error}
          </div>
        )}

        {!cargando && !error && ventas.length === 0 && (
          <p className="muted">Aún no se han registrado ventas.</p>
        )}

        {ventas.map((v) => (
          <div key={v.id} className="lote-card">
            <h4>
              V-{String(v.id).padStart(6, '0')} · {v.lotes?.productos?.nombre || 'Producto desconocido'}
            </h4>
            <p>Lote: {v.lotes?.numero_lote} · Cantidad: {v.cantidad}</p>
            <p>Fecha: {formatear(v.creado_en)}</p>
            {v.discrepancia && v.discrepancia !== 'ninguna' && (
              <span className="motivo">⚠ Discrepancia: {v.discrepancia}</span>
            )}
            {v.receta_validada && (
              <p className="muted" style={{ marginTop: 4 }}>🔒 Venta con receta validada</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
