import { Link } from 'react-router-dom'

export default function BodegaInicio() {
  return (
    <div className="page">
      <Link to="/" className="back-link">
        ← Volver al inicio
      </Link>

      <div className="panel">

        <h2>📦 Encargado de bodega</h2>

        <p className="subtitle">
          Gestión de lotes e inventario
        </p>

        <div className="note">
          Desde aquí puedes registrar nuevos lotes,
          revisar el inventario, consultar la trazabilidad
          y visualizar alertas sanitarias.
        </div>

        <ol className="steps">
          <li><b>1.</b> Registrar lote</li>
          <li><b>2.</b> Validar datos</li>
          <li><b>3.</b> Revisar stock máximo</li>
          <li><b>4.</b> Aprobar o rechazar lote</li>
          <li><b>5.</b> Registrar en inventario</li>
        </ol>

        <div className="acciones col">

          <Link to="/bodega/registrar">
            <button className="btn">
              📦 Registrar lote
            </button>
          </Link>

          <Link to="/bodega/inventario">
            <button className="btn secondary">
              📋 Ver inventario
            </button>
          </Link>

          <Link to="/bodega/trazabilidad">
            <button className="btn secondary">
              📜 Ver trazabilidad
            </button>
          </Link>

          <Link to="/bodega/alertas">
            <button className="btn secondary">
              ⚠️ Ver alertas
            </button>
          </Link>

        </div>

      </div>
    </div>
  )
}