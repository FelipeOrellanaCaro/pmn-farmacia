export default function PasoValidacion({
  lote,
  onContinuar,
}) {

  return (
    <div>

      <h3>✅ Validación de datos</h3>

      <ul>
        <li>Medicamento: {lote.medicamento}</li>
        <li>Proveedor: {lote.proveedor}</li>
        <li>Cantidad: {lote.cantidad}</li>
        <li>Vencimiento: {lote.vencimiento}</li>
      </ul>

      <button
        className="btn"
        onClick={onContinuar}
      >
        Validar lote
      </button>

    </div>
  )
}