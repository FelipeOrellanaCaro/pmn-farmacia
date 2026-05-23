import { Link } from 'react-router-dom'

// RECORRIDO 1 — Encargado de bodega (persona A)
// Punto de partida del recorrido. Agrega aquí las pantallas siguientes
// y registra sus rutas en src/App.jsx, por ejemplo:
//   <Route path="/bodega/registrar" element={<RegistrarLote />} />

export default function BodegaInicio() {
  return (
    <div className="page">
      <Link to="/" className="back-link">← Volver al inicio</Link>

      <div className="panel">
        <h2>📦 Encargado de bodega</h2>
        <p className="subtitle">Recorrido: registro y validación de un lote</p>

        <div className="note">
          Esta es la pantalla inicial de tu recorrido. Construye desde aquí las
          siguientes pantallas según el diagrama de la Fase 1.
        </div>

        <ol className="steps">
          <li><b>1.</b> Registrar lote — fecha de vencimiento, cantidad, proveedor</li>
          <li><b>2.</b> ¿Datos válidos? → si no, rechazar lote</li>
          <li><b>3.</b> ¿Supera stock máximo? → notificar exceso / aprobar</li>
          <li><b>4.</b> Estado del lote: Almacenado → Disponible para uso</li>
          <li><b>5.</b> Registrar en BD / Inventario Central</li>
        </ol>

        <button className="btn" type="button">Comenzar registro (TODO)</button>
      </div>
    </div>
  )
}
