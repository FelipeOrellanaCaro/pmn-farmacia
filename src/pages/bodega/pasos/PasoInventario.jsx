import { supabase } from '../../../lib/supabase'

export default function PasoInventario({
  onContinuar,
}) {

  const probarSupabase =
    async () => {

      const {
        data,
        error
      } = await supabase
        .from('productos')
        .select('*')

      console.log(
        'PRODUCTOS:'
      )

      console.log(data)

      console.log(
        'ERROR:'
      )

      console.log(error)
    }

  return (
    <div>

      <h3>
        💾 Inventario Central
      </h3>

      <p>
        El lote será registrado en la base de datos.
      </p>

      <button
        className="btn"
        onClick={probarSupabase}
      >
        Probar Supabase
      </button>

      <button
        className="btn"
        onClick={onContinuar}
      >
        Finalizar registro
      </button>

    </div>
  )
}