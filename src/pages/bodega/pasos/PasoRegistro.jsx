import { useState } from 'react'

export default function PasoRegistro({ onContinuar }) {

  const [datos, setDatos] = useState({
    medicamento: '',
    proveedor: '',
    cantidad: '',
    vencimiento: '',
  })

  const handleChange = (e) => {

    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onContinuar(datos)
  }

  return (
    <form onSubmit={handleSubmit} className="form">

      <input
        type="text"
        name="medicamento"
        placeholder="Medicamento"
        onChange={handleChange}
      />

      <input
        type="text"
        name="proveedor"
        placeholder="Proveedor"
        onChange={handleChange}
      />

      <input
        type="number"
        name="cantidad"
        placeholder="Cantidad"
        onChange={handleChange}
      />

      <input
        type="date"
        name="vencimiento"
        onChange={handleChange}
      />

      <button className="btn" type="submit">
        Continuar
      </button>

    </form>
  )
}