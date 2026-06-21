-- =====================================================================
-- Esquema de base de datos — PMV Sistema de Gestión de Lotes Farmacéuticos
-- =====================================================================
-- Reconstrucción del esquema mínimo requerido por el sistema, inferida
-- desde las consultas del código fuente (src/pages/bodega/* y
-- src/pages/admin/Dashboard.jsx).
--
-- Para reproducir el sistema desde cero:
--   1. Crear un proyecto nuevo en https://supabase.com
--   2. Ejecutar este script en el SQL Editor (Database → SQL Editor)
--   3. Cargar los datos semilla del final del archivo
--   4. Reemplazar la URL y la clave anon en src/lib/supabase.js
-- =====================================================================


-- Productos del catálogo (medicamentos vendibles)
create table if not exists public.productos (
    id              bigserial primary key,
    nombre          text not null unique,
    requiere_receta boolean not null default false,
    creado_en       timestamptz not null default now()
);

-- Proveedores de los lotes
create table if not exists public.proveedores (
    id        bigserial primary key,
    nombre    text not null unique,
    creado_en timestamptz not null default now()
);

-- Usuarios del sistema (referenciados por trazabilidad e ingresado_por)
create table if not exists public.usuarios (
    id        bigserial primary key,
    nombre    text not null,
    rol       text not null check (rol in ('bodega', 'farmacia', 'admin')),
    creado_en timestamptz not null default now()
);

-- Lotes ingresados a bodega
create table if not exists public.lotes (
    id                bigserial primary key,
    producto_id       bigint not null references public.productos(id),
    proveedor_id      bigint not null references public.proveedores(id),
    numero_lote       text not null unique,
    fecha_vencimiento date not null,
    cantidad_inicial  integer not null check (cantidad_inicial >= 0),
    cantidad_actual   integer not null check (cantidad_actual >= 0),
    estado            text not null
        check (estado in ('almacenado', 'aprobado', 'bloqueado', 'vencido', 'eliminado')),
    ingresado_por     bigint not null references public.usuarios(id),
    creado_en         timestamptz not null default now()
);

-- Trazabilidad: historial de eventos sobre cada lote
create table if not exists public.trazabilidad (
    id            bigserial primary key,
    lote_id       bigint not null references public.lotes(id) on delete cascade,
    usuario_id    bigint not null references public.usuarios(id),
    accion        text not null,
    descripcion   text,
    estado_nuevo  text,
    creado_en     timestamptz not null default now()
);

-- Alertas sanitarias emitidas sobre lotes o productos
create table if not exists public.alertas (
    id           bigserial primary key,
    tipo_alerta  text not null,
    descripcion  text not null,
    lote_id      bigint references public.lotes(id) on delete set null,
    producto_id  bigint references public.productos(id) on delete set null,
    creado_en    timestamptz not null default now()
);

-- Ventas concretadas en farmacia
create table if not exists public.ventas (
    id              bigserial primary key,
    lote_id         bigint not null references public.lotes(id),
    cantidad        integer not null check (cantidad > 0),
    realizada_por   bigint not null references public.usuarios(id),
    receta_validada boolean not null default false,
    discrepancia    text check (discrepancia in ('ninguna', 'leve', 'grave')),
    creado_en       timestamptz not null default now()
);


-- =====================================================================
-- Row Level Security (RLS)
-- =====================================================================
-- El cliente del PMV usa la clave anon (publishable). Habilitar RLS y
-- agregar políticas explícitas según el caso real de uso. Para la
-- demostración del PMV se permite lectura/escritura anónima.
-- =====================================================================

alter table public.productos      enable row level security;
alter table public.proveedores    enable row level security;
alter table public.usuarios       enable row level security;
alter table public.lotes          enable row level security;
alter table public.trazabilidad   enable row level security;
alter table public.alertas        enable row level security;
alter table public.ventas         enable row level security;

-- Políticas permisivas para la demostración del PMV.
-- En producción reemplazar por políticas basadas en auth.uid() y rol.
create policy "demo all productos"    on public.productos    for all using (true) with check (true);
create policy "demo all proveedores"  on public.proveedores  for all using (true) with check (true);
create policy "demo all usuarios"     on public.usuarios     for all using (true) with check (true);
create policy "demo all lotes"        on public.lotes        for all using (true) with check (true);
create policy "demo all trazabilidad" on public.trazabilidad for all using (true) with check (true);
create policy "demo all alertas"      on public.alertas      for all using (true) with check (true);
create policy "demo all ventas"       on public.ventas       for all using (true) with check (true);


-- =====================================================================
-- Datos semilla mínimos para ejecutar el sistema
-- =====================================================================

insert into public.usuarios (id, nombre, rol) values
    (1, 'Usuario sistema', 'bodega')
on conflict (id) do nothing;

insert into public.productos (nombre, requiere_receta) values
    ('Paracetamol 500mg',  false),
    ('Amoxicilina 500mg',  true),
    ('Ibuprofeno 400mg',   false)
on conflict (nombre) do nothing;

insert into public.proveedores (nombre) values
    ('Laboratorio Chile'),
    ('Farmaceutica Andes')
on conflict (nombre) do nothing;

-- Alineamos las secuencias por si se insertaron IDs explícitos.
select setval('public.usuarios_id_seq',    (select coalesce(max(id), 1) from public.usuarios));
select setval('public.productos_id_seq',   (select coalesce(max(id), 1) from public.productos));
select setval('public.proveedores_id_seq', (select coalesce(max(id), 1) from public.proveedores));
