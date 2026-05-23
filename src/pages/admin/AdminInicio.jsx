import { Link } from 'react-router-dom'

// PLACEHOLDER — Administrador
// Fuera del alcance del PMN. Se deja como pantalla informativa.

export default function AdminInicio() {
  return (
    <div className="page">
      <Link to="/" className="back-link">← Volver al inicio</Link>

      <div className="panel">
        <h2>⚙️ Administrador</h2>
        <p className="subtitle">Gestión de usuarios y configuración</p>

        <div className="note">
          Este rol queda fuera del alcance del PMN. Se incluye en el main solo
          para mostrar el modelo completo de actores de la Fase 1.
        </div>
      </div>
    </div>
  )
}
