export default function Stepper({ pasoActual }) {

  const pasos = [
    'registro',
    'validacion',
    'stock',
    'estado',
    'inventario',
  ]

  return (
    <div className="stepper">

      {pasos.map((paso) => (

        <div
          key={paso}
          className={
            paso === pasoActual
              ? 'step active'
              : 'step'
          }
        >
          {paso}
        </div>

      ))}

    </div>
  )
}