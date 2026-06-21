export default function Resultado({
  fin,
  onReiniciar,
}) {

  return (
    <div>

      <h3>
        {fin.ok ? '✅' : '❌'} {fin.titulo}
      </h3>

      <p>{fin.detalle}</p>

      <button
        className="btn"
        onClick={onReiniciar}
      >
        Reiniciar flujo
      </button>

    </div>
  )
}