export const obtenerLotes = () => {

  const lotes = localStorage.getItem('lotes')

  return lotes
    ? JSON.parse(lotes)
    : []
}

export const guardarLote = (nuevoLote) => {

  const lotes = obtenerLotes()

  lotes.push({
    id: crypto.randomUUID(),

    ...nuevoLote,

    fechaRegistro: new Date().toLocaleString('es-CL'),
  })

  localStorage.setItem(
    'lotes',
    JSON.stringify(lotes, null, 2)
  )
}