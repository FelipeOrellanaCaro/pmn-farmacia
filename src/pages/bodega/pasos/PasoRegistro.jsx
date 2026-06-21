import { useState } from 'react'

export default function PasoRegistro({ onContinuar }) {
  const [datos, setDatos] = useState({
    medicamento: '',
    proveedor: '',
    cantidad: '',
    vencimiento: '',
  })

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onContinuar(datos)
  }

  const completo =
    datos.medicamento && datos.proveedor && datos.cantidad && datos.vencimiento

  return (
    <form onSubmit={handleSubmit} className="paso">
      <h3>1. Registrar lote</h3>
      <p className="step-desc">
        Ingresa los datos del lote que llega a bodega. Todos los campos son obligatorios.
      </p>

      <label className="field">
        <span>Medicamento</span>
        <select
          name="medicamento"
          value={datos.medicamento}
          onChange={handleChange}
        >
          <option value="">— Seleccione medicamento —</option>
          <option value="Paracetamol 500mg">Paracetamol 500 mg</option>
          <option value="Amoxicilina 500mg">Amoxicilina 500 mg</option>
          <option value="Ibuprofeno 400mg">Ibuprofeno 400 mg</option>
        </select>
      </label>

      <label className="field">
        <span>Proveedor</span>
        <select
          name="proveedor"
          value={datos.proveedor}
          onChange={handleChange}
        >
          <option value="">— Seleccione proveedor —</option>
          <option value="Laboratorio Chile">Laboratorio Chile</option>
          <option value="Farmaceutica Andes">Farmaceutica Andes</option>
        </select>
      </label>

      <label className="field">
        <span>Cantidad</span>
        <input
          type="number"
          name="cantidad"
          min="1"
          placeholder="Ej: 100"
          value={datos.cantidad}
          onChange={handleChange}
        />
      </label>

      <label className="field">
        <span>Fecha de vencimiento</span>
        <input
          type="date"
          name="vencimiento"
          value={datos.vencimiento}
          onChange={handleChange}
        />
      </label>

      <button className="btn" type="submit" disabled={!completo}>
        Continuar →
      </button>
    </form>
  )
}
