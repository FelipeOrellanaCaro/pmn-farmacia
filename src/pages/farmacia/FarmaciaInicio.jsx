import { Link } from 'react-router-dom'

// RECORRIDO 2 — Auxiliar de farmacia (persona B)
// Punto de partida del recorrido. Agrega aquí las pantallas siguientes
// y registra sus rutas en src/App.jsx, por ejemplo:
//   <Route path="/farmacia/venta" element={<SolicitarVenta />} />

export default function FarmaciaInicio() {
  return (
    <div className="page">
      <Link to="/" className="back-link">← Volver al inicio</Link>

      <div className="panel">
        <h2>💊 Auxiliar de farmacia</h2>
        <p className="subtitle">Recorrido: venta con selección de lote por FEFO</p>

        <div className="note">
          Esta es la pantalla inicial de tu recorrido. Construye desde aquí las
          siguientes pantallas según el diagrama de la Fase 1.
        </div>

        <ol className="steps">
          <li><b>1.</b> Solicitar venta → ¿hay stock del producto?</li>
          <li><b>2.</b> Seleccionar lote por <b>FEFO</b> (el corazón del recorrido)</li>
          <li><b>3.</b> ¿Lote con alerta sanitaria / vencido? → tomar el siguiente válido</li>
          <li><b>4.</b> ¿Requiere receta médica? → validar receta</li>
          <li><b>5.</b> Escanear caja física → ¿coincide con el lote sugerido?</li>
          <li><b>6.</b> Concretar venta → actualizar stock → registrar trazabilidad</li>
        </ol>

        <button className="btn" type="button">Comenzar venta (TODO)</button>
      </div>
    </div>
  )
}
