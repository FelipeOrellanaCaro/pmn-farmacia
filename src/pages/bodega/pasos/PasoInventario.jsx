export default function PasoInventario({ onContinuar, cargando }) {
  return (
    <div className="paso">
      <h3>5. Registrar en inventario</h3>
      <p className="step-desc">
        El lote se insertará en la base de datos junto con su evento de trazabilidad.
        Esta acción no se puede deshacer.
      </p>

      <button className="btn" onClick={onContinuar} disabled={cargando}>
        {cargando ? 'Registrando…' : 'Confirmar registro en inventario'}
      </button>
    </div>
  )
}
