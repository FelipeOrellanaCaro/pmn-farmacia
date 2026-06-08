import { Link } from 'react-router-dom'

export default function AdminInicio() {

  return (

    <div className="page">

      <Link
        to="/"
        className="back-link"
      >
        ← Volver al inicio
      </Link>

      <div className="panel">

        <h2>
          ⚙️ Administrador
        </h2>

        <p className="subtitle">
          Gestión general del sistema
        </p>

        <div className="note">
          Desde aquí puedes acceder al dashboard
          y visualizar información global.
        </div>

        <div className="acciones col">

          <Link to="/admin/dashboard">
            <button className="btn">
              📊 Dashboard
            </button>
          </Link>

        </div>

      </div>

    </div>

  )
}