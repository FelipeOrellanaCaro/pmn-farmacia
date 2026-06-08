import { useState } from 'react'

export default function PasoRegistro({
  onContinuar,
}) {

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

    <form
      onSubmit={handleSubmit}
      className="form"
    >

      <select
        name="medicamento"
        onChange={handleChange}
      >

        <option value="">
          Seleccione medicamento
        </option>

        <option value="Paracetamol 500mg">
          Paracetamol 500mg
        </option>

        <option value="Amoxicilina 500mg">
          Amoxicilina 500mg
        </option>

        <option value="Ibuprofeno 400mg">
          Ibuprofeno 400mg
        </option>

      </select>

      <select
        name="proveedor"
        onChange={handleChange}
      >

        <option value="">
          Seleccione proveedor
        </option>

        <option value="Laboratorio Chile">
          Laboratorio Chile
        </option>

        <option value="Farmaceutica Andes">
          Farmaceutica Andes
        </option>

      </select>

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

      <button
        className="btn"
        type="submit"
      >
        Continuar
      </button>

    </form>
  )
}