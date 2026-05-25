export default function PasoEstado({
  onContinuar,
}) {

  return (
    <div>

      <h3>📦 Estado del lote</h3>

      <ul>
        <li>Estado: Almacenado</li>
        <li>Estado: Disponible para uso</li>
      </ul>

      <button
        className="btn"
        onClick={onContinuar}
      >
        Registrar inventario
      </button>

    </div>
  )
}