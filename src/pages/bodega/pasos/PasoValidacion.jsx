export default function PasoValidacion({ lote, onContinuar }) {
  return (
    <div className="paso">
      <h3>2. Validación de datos</h3>
      <p className="step-desc">
        Verifica que los datos ingresados sean correctos antes de continuar.
      </p>

      <ul className="resumen">
        <li><span>Medicamento</span><b>{lote.medicamento}</b></li>
        <li><span>Proveedor</span><b>{lote.proveedor}</b></li>
        <li><span>Cantidad</span><b>{lote.cantidad}</b></li>
        <li><span>Vencimiento</span><b>{lote.vencimiento}</b></li>
      </ul>

      <button className="btn" onClick={onContinuar}>
        Validar lote →
      </button>
    </div>
  )
}
