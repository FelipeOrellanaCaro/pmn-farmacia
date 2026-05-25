export default function PasoInventario({
  onContinuar,
}) {

  return (
    <div>

      <h3>💾 Inventario Central</h3>

      <p>
        El lote será registrado en la base de datos.
      </p>

      <button
        className="btn"
        onClick={onContinuar}
      >
        Finalizar registro
      </button>

    </div>
  )
}