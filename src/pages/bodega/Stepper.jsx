const PASOS = [
  { id: 'registro', label: 'Registro' },
  { id: 'validacion', label: 'Validación' },
  { id: 'stock', label: 'Stock máx.' },
  { id: 'estado', label: 'Estado' },
  { id: 'inventario', label: 'Inventario' },
]

export default function Stepper({ pasoActual }) {
  const indiceActual = PASOS.findIndex((p) => p.id === pasoActual)

  return (
    <ol className="stepper">
      {PASOS.map((p, i) => {
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
