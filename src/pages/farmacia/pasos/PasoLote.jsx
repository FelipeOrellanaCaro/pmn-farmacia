export default function PasoLote({ venta, onContinuar }) {
  const { loteSugerido, descartados } = venta

  return (
    <div className="paso">
      <h3>2. Selección de lote por FEFO</h3>
      <p className="step-desc">
        El sistema sugiere automáticamente el lote que vence primero
        (<i>First Expired, First Out</i>), descartando vencidos y con alerta.
      </p>

      <div className="lote-card sugerido">
        <span className="badge activo">Lote sugerido</span>
        <h4>{loteSugerido.codigo}</h4>
        <p>Vence: {loteSugerido.vence} · Stock: {loteSugerido.stock}</p>
      </div>

      {descartados.length > 0 && (
        <div className="descartados">
          <p className="muted">Lotes descartados automáticamente:</p>
          {descartados.map((l) => (
            <div key={l.codigo} className="lote-card descartado">
              <h4>{l.codigo}</h4>
              <p>Vence: {l.vence} · Stock: {l.stock}</p>
              <span className="motivo">⚠ {l.motivo}</span>
            </div>
          ))}
        </div>
      )}

      <button className="btn" onClick={onContinuar}>
        Continuar →
      </button>
    </div>
  )
}
