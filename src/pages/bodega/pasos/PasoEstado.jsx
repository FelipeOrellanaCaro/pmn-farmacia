export default function PasoEstado({ onContinuar }) {
  return (
    <div className="paso">
      <h3>4. Estado del lote</h3>
      <p className="step-desc">
        Tras la validación, el lote transiciona por los siguientes estados:
      </p>

      <ul className="resumen">
        <li><span>Estado inicial</span><b>Almacenado</b></li>
        <li><span>Estado final</span><b>Disponible para uso</b></li>
      </ul>

      <button className="btn" onClick={onContinuar}>
        Continuar al inventario →
      </button>
    </div>
  )
}
