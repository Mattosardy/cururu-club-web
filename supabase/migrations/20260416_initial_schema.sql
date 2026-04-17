create extension if not exists pgcrypto with schema extensions;

create table if not exists public.socios (
    id uuid primary key default gen_random_uuid(),
    numero_socio integer unique,
    nombre text not null,
    apellido text not null,
    cedula text unique,
    telefono text,
    email text unique,
    fecha_nacimiento date,
    direccion text,
    fecha_ingreso date not null default current_date,
    fecha_renovacion date,
    estado text not null default 'pendiente',
    activo boolean not null default true,
    suspendido_hasta date,
    motivo_suspension text,
    notificacion_whatsapp boolean not null default true,
    notificacion_email boolean not null default false,
    rol text not null default 'socio',
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.lotes_cosecha (
    id uuid primary key default gen_random_uuid(),
    codigo_lote text unique not null,
    cepa text not null,
    fecha_cosecha date not null,
    cantidad_gramos_total integer not null,
    cantidad_gramos_disponible integer not null,
    thc_porcentaje numeric(5,2),
    cbd_porcentaje numeric(5,2),
    fecha_analisis date,
    archivo_analisis_url text,
    estado text not null default 'disponible',
    created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.reservas_mensuales (
    id uuid primary key default gen_random_uuid(),
    socio_id uuid references public.socios(id) on delete cascade,
    mes integer not null,
    "año" integer not null,
    cantidad_gramos integer not null check (cantidad_gramos in (20, 40)),
    fecha_retiro date not null,
    tipo_entrega text not null,
    fecha_confirmacion timestamptz,
    estado text not null default 'pendiente',
    lote_id uuid references public.lotes_cosecha(id),
    peso_real_entregado integer,
    entregado_por uuid,
    fecha_entrega_real timestamptz,
    created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.noticias (
    id uuid primary key default gen_random_uuid(),
    titulo text not null,
    contenido text not null,
    imagen_url text,
    autor text,
    fecha_publicacion timestamptz not null default timezone('utc'::text, now()),
    destacado boolean not null default false,
    activo boolean not null default true,
    created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.productos (
    id uuid primary key default gen_random_uuid(),
    nombre text not null,
    descripcion text,
    imagen_url text,
    cepa text,
    thc_porcentaje numeric(5,2),
    cbd_porcentaje numeric(5,2),
    fecha_cosecha date,
    lote_id uuid references public.lotes_cosecha(id),
    disponible boolean not null default true,
    precio_por_10g numeric(10,2) not null default 1600,
    indica_sativa text,
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.productos_imagenes (
    id uuid primary key default gen_random_uuid(),
    producto_id uuid not null references public.productos(id) on delete cascade,
    imagen_url text not null,
    orden integer not null default 0,
    created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.actividades (
    id uuid primary key default gen_random_uuid(),
    titulo text not null,
    descripcion text,
    fecha date not null,
    hora time,
    ubicacion text,
    imagen_url text,
    cupo_maximo integer,
    cupos_disponibles integer,
    activo boolean not null default true,
    tipo text not null default 'actividad',
    created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.solicitudes_membresia (
    id uuid primary key default gen_random_uuid(),
    nombre text not null,
    apellido text not null,
    cedula text not null,
    telefono text not null,
    email text,
    mensaje text,
    estado text not null default 'pendiente',
    fecha_solicitud timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.logs_actividad (
    id uuid primary key default gen_random_uuid(),
    usuario_id uuid,
    usuario_tipo text,
    accion text not null,
    ip_address text,
    user_agent text,
    detalles jsonb,
    created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.configuracion_sistema (
    id uuid primary key default gen_random_uuid(),
    clave text not null unique,
    valor text not null,
    descripcion text,
    updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.calificaciones_productos (
    id uuid primary key default gen_random_uuid(),
    producto_id uuid not null references public.productos(id) on delete cascade,
    socio_id uuid not null references public.socios(id) on delete cascade,
    puntuacion integer not null check (puntuacion between 1 and 5),
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now()),
    constraint calificaciones_productos_producto_socio_key unique (producto_id, socio_id)
);

create index if not exists idx_socios_cedula on public.socios(cedula);
create index if not exists idx_socios_estado on public.socios(estado);
create index if not exists idx_reservas_socio on public.reservas_mensuales(socio_id);
create index if not exists idx_reservas_fecha on public.reservas_mensuales(fecha_retiro);
create index if not exists idx_noticias_fecha on public.noticias(fecha_publicacion desc);
create index if not exists idx_productos_imagenes_producto on public.productos_imagenes(producto_id, orden);
create index if not exists idx_actividades_fecha on public.actividades(fecha);

insert into public.configuracion_sistema (clave, valor, descripcion)
values
    ('limite_gramos_mensual', '40', 'Gramos maximos por socio al mes'),
    ('opciones_gramos', '20,40', 'Opciones de retiro disponibles'),
    ('dias_anticipacion_ultimo', '4', 'Dias antes del ultimo jueves para recordatorio'),
    ('dias_anticipacion_primer', '2', 'Dias antes del primer jueves para recordatorio'),
    ('horas_limite_ultimo', '72', 'Horas antes del ultimo jueves para confirmar'),
    ('horas_limite_primer', '48', 'Horas antes del primer jueves para confirmar'),
    ('historia_texto', 'Nacio como un espacio de encuentro para la comunidad cannabica en Uruguay.', 'Texto institucional principal'),
    ('cifra_socios', '38', 'Socios activos destacados en home'),
    ('cifra_cepas', '120', 'Cepas cultivadas destacadas en home'),
    ('cifra_anios', '8', 'Anios de experiencia destacados en home'),
    ('historia_galeria', '[]', 'Galeria institucional en formato JSON')
on conflict (clave) do nothing;
