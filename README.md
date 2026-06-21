# PMV — Sistema de Gestión de Lotes Farmacéuticos

Prototipo Mínimo Viable. Aplicación web navegable que cubre el ciclo de vida del
lote farmacéutico desde su ingreso a bodega hasta su venta, con persistencia real
en Supabase para los recorridos de Bodega y Administrador, y datos simulados para
el recorrido de Farmacia (selección por FEFO).

## Cómo correrlo

Requisitos: Node.js 18+ y pnpm (`corepack enable pnpm` si no lo tienes).

```bash
pnpm install
pnpm run dev
```

Abre la URL que muestra Vite (por defecto http://localhost:5173).

> Las credenciales de Supabase ya están en `src/lib/supabase.js`. Si quieres
> apuntar a tu propio proyecto de Supabase, reemplázalas ahí y carga el esquema
> de `docs/esquema-supabase.sql` (ver más abajo).

## Estructura

```
src/
  App.jsx                  Ruteo central
  lib/supabase.js          Cliente Supabase
  pages/
    Home.jsx               Selección de rol
    farmacia/              Recorrido Auxiliar de farmacia (Felipe)
      catalogo.js            Datos simulados + motor FEFO
      VentaFlow.jsx          Wizard de venta
      Stepper.jsx
      pasos/
    bodega/                Recorrido Encargado de bodega (Claudio)
      BodegaInicio.jsx       Menú
      BodegaReg.jsx          Wizard de registro (escribe en Supabase)
      Inventario.jsx
      Trazabilidad.jsx
      Alertas.jsx
      Stepper.jsx
      pasos/
    admin/                 Recorrido Administrador
      AdminInicio.jsx
      Dashboard.jsx          Estadísticas globales desde BD
docs/
  esquema-supabase.sql     Esquema y datos semilla para reproducir la BD
```

## Recorridos implementados

- **Auxiliar de farmacia** — venta con selección de lote por FEFO, validación de
  receta, escaneo físico con manejo de discrepancias y registro de trazabilidad.
- **Encargado de bodega** — registro de lote con persistencia en Supabase, más
  pantallas de inventario, trazabilidad y alertas.
- **Administrador** — dashboard con conteos globales (productos, lotes, ventas).

## Reproducir la base de datos

Si quieres recrear la BD desde cero en tu propio proyecto de Supabase:

1. Crea un proyecto nuevo en https://supabase.com
2. Database → SQL Editor → ejecuta `docs/esquema-supabase.sql`
3. Copia la URL del proyecto y la `anon key` desde Settings → API
4. Reemplaza ambos valores en `src/lib/supabase.js`

## Tecnologías

React 18 + Vite 5 · React Router 6 · Supabase (Postgres) · pnpm 11
