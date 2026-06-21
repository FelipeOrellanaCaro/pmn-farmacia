export default function PasoStock({ lote, onContinuar }) {
  return (
    <div className="paso">
      <h3>3. Revisión de stock máximo</h3>
      <p className="step-desc">
        El sistema detectó que la cantidad recibida supera el umbral de stock máximo.
      </p>

      <div className="alert warning">
        <strong>⚠️ Exceso de stock</strong>
        <p>
          Cantidad recibida: <b>{lote.cantidad}</b> unidades · Umbral configurado: <b>500</b>
        </p>
        <p>
          El lote igual será almacenado pero queda registrado el exceso para revisión posterior.
        </p>
      </div>

      <button className="btn" onClick={onContinuar}>
        Continuar →
      </button>
    </div>
  )
}
