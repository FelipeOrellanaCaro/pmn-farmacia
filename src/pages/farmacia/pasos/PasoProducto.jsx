import { useState } from 'react'
import { catalogo } from '../catalogo'

export default function PasoProducto({ venta, onContinuar }) {
  const [productoId, setProductoId] = useState(venta.producto?.id || '')
  const [cantidad, setCantidad] = useState(venta.cantidad || 1)
  const producto = catalogo.find((p) => p.id === productoId)

  return (
    <div className="paso">
      <h3>1. Solicitar venta</h3>
      <p className="step-desc">Selecciona el producto y la cantidad a vender.</p>

      <label className="field">
        <span>Producto</span>
        <select value={productoId} onChange={(e) => setProductoId(e.target.value)}>
          <option value="">— Elige un producto —</option>
          {catalogo.map((p) => (
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

      <button className="btn" disabled={!producto} onClick={() => onContinuar(producto, cantidad)}>
        Continuar →
      </button>
    </div>
  )
}
