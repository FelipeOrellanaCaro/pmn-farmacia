import { useState } from 'react'

export default function PasoConfirmar({ venta, onConcretar, cargando }) {
  const [verificado, setVerificado] = useState(false)
  const lote = venta.loteFisico || venta.loteSugerido

  return (
    <div className="paso">
      <h3>5. Confirmar venta</h3>
      <p className="step-desc">Revisa el resumen y confirma para concretar la venta.</p>

      <ul className="resumen">
        <li><span>Producto</span><b>{venta.producto.nombre}</b></li>
        <li><span>Cantidad</span><b>{venta.cantidad}</b></li>
        <li><span>Lote</span><b>{lote.codigo}</b></li>
        {venta.discrepancia === 'leve' && (
          <li><span>Discrepancia</span><b>Leve (se registrará)</b></li>
        )}
      </ul>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={verificado}
          onChange={(e) => setVerificado(e.target.checked)}
        />
        Verifiqué el producto, el lote y la cantidad
      </label>

      <button className="btn" disabled={!verificado || cargando} onClick={onConcretar}>
        {cargando ? 'Concretando…' : 'Concretar venta'}
      </button>
    </div>
  )
}
