import { Link } from 'react-router-dom'

export default function Resultado({ fin, onReiniciar }) {
  return (
    <div className={`resultado ${fin.ok ? 'ok' : 'bloqueado'}`}>
      <div className="resultado-icono">{fin.ok ? '✅' : '⛔'}</div>
      <h3>{fin.titulo}</h3>
      <p className="step-desc">{fin.detalle}</p>

      {fin.ok && fin.numeroLote && (
        <div className="trazabilidad">
          <p className="muted">Trazabilidad registrada</p>
          <ul className="resumen">
            <li><span>N° de lote</span><b>{fin.numeroLote}</b></li>
            <li><span>Medicamento</span><b>{fin.medicamento}</b></li>
            <li><span>Proveedor</span><b>{fin.proveedor}</b></li>
            <li><span>Cantidad</span><b>{fin.cantidad}</b></li>
            <li><span>Estado</span><b>Almacenado</b></li>
            <li><span>Fecha</span><b>{fin.fecha}</b></li>
          </ul>
          <p className="muted">✔ Inventario y trazabilidad actualizados en BD</p>
        </div>
      )}

      <div className="acciones">
        <button className="btn" onClick={onReiniciar}>Registrar otro lote</button>
        <Link to="/" className="btn secondary">Volver al inicio</Link>
      </div>
    </div>
  )
}
