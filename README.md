# PMN — Gestión de Lotes Farmacéuticos

Prototipo Mínimo Navegable (Fase 2). Maqueta visual centrada en recorridos clave
del modelo logrado en la Fase 1.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto http://localhost:5173).

## Estructura

```
src/
  App.jsx              ← rutas de toda la app
  pages/
    Home.jsx           ← el "main": pantalla de selección de rol
    bodega/            ← Recorrido 1 — Encargado de bodega (persona A)
      BodegaInicio.jsx
    farmacia/          ← Recorrido 2 — Auxiliar de farmacia (persona B)
      FarmaciaInicio.jsx
    admin/             ← Placeholder (fuera del alcance del PMN)
      AdminInicio.jsx
```

## Cómo trabaja cada persona

Cada quien desarrolla **un recorrido dentro de su propia carpeta** para no pisarse:

- **Persona A** → `src/pages/bodega/` (registro y validación de lote)
- **Persona B** → `src/pages/farmacia/` (venta con selección por FEFO)

Para agregar una pantalla nueva:

1. Crea el componente en tu carpeta, ej. `src/pages/farmacia/SolicitarVenta.jsx`
2. Regístralo como ruta en `src/App.jsx`, ej.
   `<Route path="/farmacia/venta" element={<SolicitarVenta />} />`
3. Enlaza hacia él con `<Link to="/farmacia/venta">` o `useNavigate()`

## Alcance (PMN)

El objetivo NO es construir todo el sistema, sino simular **dos recorridos
coherentes** que "se sientan reales". El rol Administrador y los flujos de
monitoreo/autoridad sanitaria quedan fuera del alcance a propósito.
