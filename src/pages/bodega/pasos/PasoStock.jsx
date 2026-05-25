export default function PasoStock({
  lote,
  onContinuar,
}) {

  return (
    <div>

      <h3>⚠️ Exceso de stock</h3>

      <p>
        El lote supera el stock máximo permitido.
      </p>

      <p>
        Cantidad recibida: {lote.cantidad}
      </p>

      <button
        className="btn"
        onClick={onContinuar}
      >
        Continuar
      </button>

    </div>
  )
}