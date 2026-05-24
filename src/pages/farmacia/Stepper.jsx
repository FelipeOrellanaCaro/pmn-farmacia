const PASOS = [
  { id: 'producto', label: 'Producto' },
  { id: 'lote', label: 'Lote (FEFO)' },
  { id: 'receta', label: 'Receta' },
  { id: 'escaneo', label: 'Escaneo' },
  { id: 'confirmar', label: 'Confirmar' },
]

export default function Stepper({ pasoActual, requiereReceta }) {
  const pasos = PASOS.filter((p) => p.id !== 'receta' || requiereReceta)
  const indiceActual = pasos.findIndex((p) => p.id === pasoActual)

  return (
    <ol className="stepper">
      {pasos.map((p, i) => {
        const estado = i < indiceActual ? 'hecho' : i === indiceActual ? 'actual' : 'pendiente'
        return (
          <li key={p.id} className={`step ${estado}`}>
            <span className="step-num">{i < indiceActual ? '✓' : i + 1}</span>
            <span className="step-label">{p.label}</span>
          </li>
        )
      })}
    </ol>
  )
}
