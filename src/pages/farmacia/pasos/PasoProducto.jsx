import { useEffect, useState } from 'react'
import { cargarProductos } from '../catalogo'

export default function PasoProducto({ venta, onContinuar }) {
  const [productos, setProductos] = useState([])
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true)
  const [error, setError] = useState(null)
  const [productoId, setProductoId] = useState(venta.producto?.id ?? '')
  const [cantidad, setCantidad] = useState(venta.cantidad || 1)

  useEffect(() => {
    let cancelado = false
    cargarProductos()
      .then((data) => {
        if (!cancelado) setProductos(data)
      })
      .catch((e) => {
        if (!cancelado) setError(e.message)
      })
      .finally(() => {
        if (!cancelado) setCargandoCatalogo(false)
      })
    return () => {
      cancelado = true
    }
  }, [])

  const producto = productos.find((p) => p.id === Number(productoId))

  if (cargandoCatalogo) {
    return (
      <div className="paso">
        <p className="muted">Cargando catálogo…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="paso">
        <div className="alert warning">No se pudo cargar el catálogo: {error}</div>
      </div>
    )
  }

  return (
    <div className="paso">
      <h3>1. Solicitar venta</h3>
      <p className="step-desc">Selecciona el producto y la cantidad a vender.</p>

      <label className="field">
        <span>Producto</span>
        <select value={productoId} onChange={(e) => setProductoId(e.target.value)}>
          <option value="">— Elige un producto —</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
              {p.requiereReceta ? ' (requiere receta)' : ''}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Cantidad</span>
        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
        />
      </label>

      <button
        className="btn"
        disabled={!producto || cantidad < 1}
        onClick={() => onContinuar(producto, cantidad)}
      >
        Continuar →
      </button>
    </div>
  )
}
