import { Link } from 'react-router-dom'

// RECORRIDO 2 — Auxiliar de farmacia
// Pantalla de presentación del recorrido. Inicia el flujo de venta (VentaFlow).

export default function FarmaciaInicio() {
  return (
    <div className="page">
      <Link to="/" className="back-link">← Volver al inicio</Link>

      <div className="panel">
        <h2>💊 Auxiliar de farmacia</h2>
        <p className="subtitle">Recorrido: venta con selección de lote por FEFO</p>

        <div className="note">
          Este recorrido simula una venta completa siguiendo el modelo de la Fase 1:
          selección de lote por FEFO, descarte de lotes vencidos o con alerta,
          validación de receta, verificación física por escaneo y registro de trazabilidad.
        </div>

        <ol className="steps">
          <li><b>1.</b> Solicitar venta → ¿hay stock del producto?</li>
          <li><b>2.</b> Seleccionar lote por <b>FEFO</b> (descarta vencidos / con alerta)</li>
          <li><b>3.</b> Validar receta médica (si el producto la requiere)</li>
          <li><b>4.</b> Escanear caja física → ¿coincide con el lote sugerido?</li>
          <li><b>5.</b> Confirmar → concretar venta → trazabilidad</li>
        </ol>

        <Link to="/farmacia/venta" className="btn">Iniciar venta →</Link>
      </div>
    </div>
  )
}
