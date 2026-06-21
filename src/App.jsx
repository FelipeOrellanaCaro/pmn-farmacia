import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'

// Recorrido 1 — Encargado de bodega (persona A)
import BodegaInicio from './pages/bodega/BodegaInicio.jsx'
import BodegaReg from './pages/bodega/BodegaReg.jsx'
import Inventario from './pages/bodega/Inventario.jsx'
import Trazabilidad from './pages/bodega/Trazabilidad.jsx'
import Alertas from './pages/bodega/Alertas.jsx'

// Recorrido 2 — Auxiliar de farmacia (persona B)
import FarmaciaInicio from './pages/farmacia/FarmaciaInicio.jsx'
import VentaFlow from './pages/farmacia/VentaFlow.jsx'

// Placeholder — Administrador (fuera del alcance del PMN)
import AdminInicio from './pages/admin/AdminInicio.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Cada persona agrega sus pantallas dentro de su carpeta de recorrido.
          Ej: <Route path="/bodega/registrar" element={<RegistrarLote />} /> */}
      <Route path="/bodega" element={<BodegaInicio />} />
      <Route
        path="/bodega/registrar"
        element={<BodegaReg />}
      />
      <Route path="/farmacia" element={<FarmaciaInicio />} />
      <Route path="/farmacia/venta" element={<VentaFlow />} />
      <Route path="/admin" element={<AdminInicio />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/bodega/inventario" element={<Inventario />} />
      <Route path="/bodega/trazabilidad" element={<Trazabilidad />} />
      <Route path="/bodega/alertas" element={<Alertas />} />
    </Routes>
  )
}
