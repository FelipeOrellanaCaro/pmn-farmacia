import { Link } from 'react-router-dom'

const roles = [
  {
    to: '/bodega',
    icon: '📦',
    titulo: 'Encargado de bodega',
    descripcion:
      'Registra lotes (fecha de vencimiento, cantidad, proveedor), valida datos y controla el stock máximo del inventario.',
    estado: 'activo',
  },
  {
    to: '/farmacia',
    icon: '💊',
    titulo: 'Auxiliar de farmacia',
    descripcion:
      'Realiza la venta seleccionando el lote por FEFO, validando alertas, vencimiento y receta médica.',
    estado: 'activo',
  },
  {
    to: '/admin',
    icon: '⚙️',
    titulo: 'Administrador',
    descripcion:
      'Gestión de usuarios y configuración del sistema. Fuera del alcance del PMN (placeholder).',
    estado: 'placeholder',
  },
]

export default function Home() {
  return (
    <div className="page">
      <header className="brand">
        <h1>Sistema de Gestión de Lotes Farmacéuticos</h1>
        <p>Prototipo Mínimo Navegable (PMN) — selecciona un rol para iniciar el recorrido</p>
        <span className="tag">Fase 2 · Maqueta visual</span>
      </header>

      <section className="roles">
        {roles.map((r) => {
          const card = (
            <>
              <span className="icon">{r.icon}</span>
              <span className={`badge ${r.estado}`}>
                {r.estado === 'activo' ? 'Recorrido' : 'Placeholder'}
              </span>
              <h2>{r.titulo}</h2>
              <p>{r.descripcion}</p>
              <span className="cta">
                {r.estado === 'activo' ? 'Iniciar recorrido →' : 'No disponible'}
              </span>
            </>
          )
          return r.estado === 'activo' ? (
            <Link key={r.to} to={r.to} className="role-card">
              {card}
            </Link>
          ) : (
            <div key={r.to} className="role-card disabled">
              {card}
            </div>
          )
        })}
      </section>
    </div>
  )
}
