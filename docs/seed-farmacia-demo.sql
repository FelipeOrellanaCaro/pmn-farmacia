-- =====================================================================
-- Seed de datos para la demo del recorrido de Farmacia
-- =====================================================================
-- Crea lotes y una alerta sanitaria de modo que cada producto del
-- catálogo demuestre uno de los escenarios del flujo FEFO:
--   * Paracetamol → camino feliz (sin descartes)
--   * Amoxicilina → descarte por vencido + activa validación de receta
--   * Ibuprofeno  → descarte por alerta sanitaria
--   * Loratadina  → sin stock
--
-- Ejecutar UNA VEZ en el SQL Editor de Supabase después de
-- esquema-supabase.sql. Es idempotente: vuelve a correrlo si necesitas
-- reiniciar la demo, no duplica.
-- =====================================================================

-- Loratadina no estaba en el seed inicial.
insert into public.productos (nombre, requiere_receta) values
    ('Loratadina 10mg', false)
on conflict (nombre) do nothing;


-- ---------- Limpieza de datos previos de la demo ----------
-- Para que la seed sea idempotente, borra los lotes/alertas/ventas/trazabilidad
-- previos generados por esta misma seed (los identificamos por el prefijo del
-- numero_lote). NO toca lotes registrados desde el flujo de Bodega.

delete from public.trazabilidad
where lote_id in (
    select id from public.lotes where numero_lote like 'DEMO-%'
);

delete from public.ventas
where lote_id in (
    select id from public.lotes where numero_lote like 'DEMO-%'
);

delete from public.alertas
where lote_id in (
    select id from public.lotes where numero_lote like 'DEMO-%'
);

delete from public.lotes where numero_lote like 'DEMO-%';


-- ---------- Lotes de la demo ----------

-- Paracetamol: dos lotes vigentes con stock. FEFO elige el que vence antes.
insert into public.lotes
    (producto_id, proveedor_id, numero_lote, fecha_vencimiento,
     cantidad_inicial, cantidad_actual, estado, ingresado_por)
select
    p.id, prov.id, 'DEMO-PAR-001', '2027-01-15', 50, 50, 'almacenado', 1
from public.productos p, public.proveedores prov
where p.nombre = 'Paracetamol 500mg' and prov.nombre = 'Laboratorio Chile';

insert into public.lotes
    (producto_id, proveedor_id, numero_lote, fecha_vencimiento,
     cantidad_inicial, cantidad_actual, estado, ingresado_por)
select
    p.id, prov.id, 'DEMO-PAR-002', '2027-06-15', 80, 80, 'almacenado', 1
from public.productos p, public.proveedores prov
where p.nombre = 'Paracetamol 500mg' and prov.nombre = 'Farmaceutica Andes';

-- Amoxicilina: uno vencido (descartado por FEFO) + uno vigente. Requiere receta.
insert into public.lotes
    (producto_id, proveedor_id, numero_lote, fecha_vencimiento,
     cantidad_inicial, cantidad_actual, estado, ingresado_por)
select
    p.id, prov.id, 'DEMO-AMX-001', '2025-12-01', 30, 30, 'almacenado', 1
from public.productos p, public.proveedores prov
where p.nombre = 'Amoxicilina 500mg' and prov.nombre = 'Laboratorio Chile';

insert into public.lotes
    (producto_id, proveedor_id, numero_lote, fecha_vencimiento,
     cantidad_inicial, cantidad_actual, estado, ingresado_por)
select
    p.id, prov.id, 'DEMO-AMX-002', '2027-03-15', 25, 25, 'almacenado', 1
from public.productos p, public.proveedores prov
where p.nombre = 'Amoxicilina 500mg' and prov.nombre = 'Farmaceutica Andes';

-- Ibuprofeno: uno con alerta sanitaria + uno vigente sin alerta.
insert into public.lotes
    (producto_id, proveedor_id, numero_lote, fecha_vencimiento,
     cantidad_inicial, cantidad_actual, estado, ingresado_por)
select
    p.id, prov.id, 'DEMO-IBU-001', '2027-02-15', 40, 40, 'almacenado', 1
from public.productos p, public.proveedores prov
where p.nombre = 'Ibuprofeno 400mg' and prov.nombre = 'Laboratorio Chile';

insert into public.lotes
    (producto_id, proveedor_id, numero_lote, fecha_vencimiento,
     cantidad_inicial, cantidad_actual, estado, ingresado_por)
select
    p.id, prov.id, 'DEMO-IBU-002', '2027-08-15', 35, 35, 'almacenado', 1
from public.productos p, public.proveedores prov
where p.nombre = 'Ibuprofeno 400mg' and prov.nombre = 'Farmaceutica Andes';

-- Loratadina: un solo lote con stock 0, para demostrar el caso "sin stock".
insert into public.lotes
    (producto_id, proveedor_id, numero_lote, fecha_vencimiento,
     cantidad_inicial, cantidad_actual, estado, ingresado_por)
select
    p.id, prov.id, 'DEMO-LOR-001', '2027-04-01', 20, 0, 'almacenado', 1
from public.productos p, public.proveedores prov
where p.nombre = 'Loratadina 10mg' and prov.nombre = 'Laboratorio Chile';


-- ---------- Alerta sanitaria sobre el primer lote de Ibuprofeno ----------

insert into public.alertas (tipo_alerta, descripcion, lote_id)
select
    'Retiro sanitario ISP',
    'ISP solicitó el retiro del lote por inconsistencia en la formulación.',
    l.id
from public.lotes l
where l.numero_lote = 'DEMO-IBU-001';
