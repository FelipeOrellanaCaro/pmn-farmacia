export default function PasoReceta({ venta, onValidar }) {
  return (
    <div className="paso">
      <h3>3. Validación de receta médica</h3>
      <p className="step-desc">
        <b>{venta.producto.nombre}</b> requiere receta. Verifica que sea válida y esté vigente.
      </p>

      <div className="acciones col">
        <button className="btn" onClick={() => onValidar(true)}>
          ✓ Receta válida y vigente
        </button>
        <button className="btn danger" onClick={() => onValidar(false)}>
          ✗ Receta inválida o vencida
        </button>
      </div>
    </div>
  )
}
