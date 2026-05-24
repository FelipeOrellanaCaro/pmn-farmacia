import { Link } from 'react-router-dom'

export default function Resultado({ venta, onReiniciar }) {
  const { fin } = venta
  const lote = venta.loteFisico || venta.loteSugerido

  return (
    <div className={`resultado ${fin.ok ? 'ok' : 'bloqueado'}`}>
      <div className="resultado-icono">{fin.ok ? '✅' : '⛔'}</div>
      <h3>{fin.titulo}</h3>
      <p className="step-desc">{fin.detalle}</p>

      {fin.ok && (
        <div className="trazabilidad">
          <p className="muted">Trazabilidad registrada</p>
          <ul className="resumen">
            <li><span>N° venta</span><b>{fin.ventaId}</b></li>
            <li><span>Producto</span><b>{venta.producto.nombre}</b></li>
            <li><span>Lote</span><b>{lote.codigo}</b></li>
            <li><span>Cantidad</span><b>{venta.cantidad}</b></li>
            <li><span>Estado</span><b>Vendido</b></li>
            <li><span>Fecha</span><b>{fin.timestamp}</b></li>
          </ul>
          <p className="muted">✔ Stock actualizado en BD</p>
        </div>
      )}

      <div className="acciones">
        <button className="btn" onClick={onReiniciar}>Nueva venta</button>
        <Link to="/" className="btn secondary">Volver al inicio</Link>
      </div>
    </div>
  )
}
