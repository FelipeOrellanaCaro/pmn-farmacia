import { Link } from 'react-router-dom'

export default function BodegaInicio() {
  return (
    <div className="page">
      <Link to="/" className="back-link">← Volver al inicio</Link>

      <div className="panel">
        <h2>📦 Encargado de bodega</h2>

        <p className="subtitle">
          Recorrido: registro y validación de un lote
        </p>

        <div className="note">
          Flujo BPMN del proceso de recepción y validación sanitaria.
        </div>

        <ol className="steps">
          <li><b>1.</b> Registrar lote</li>
          <li><b>2.</b> Validar datos</li>
          <li><b>3.</b> Revisar stock máximo</li>
          <li><b>4.</b> Aprobar o rechazar lote</li>
          <li><b>5.</b> Registrar en inventario</li>
        </ol>

        <Link to="/bodega/registrar">
          <button className="btn">
            Comenzar registro
          </button>
        </Link>
      </div>
    </div>
  )
}