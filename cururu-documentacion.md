🐸🌿 PROYECTO CURURÚ - CLUB CANÁBICO
Documento Técnico Compilado
ÍNDICE
Resumen Ejecutivo

Requisitos Funcionales

Estructura de Base de Datos (SQL Completo)

Roles y Permisos

Tecnologías Utilizadas

Estructura de Archivos

Cronograma de Sesiones

Checklist de Preparación

Preguntas Pendientes

1. RESUMEN EJECUTIVO
Club Canábico Cururú - Software de gestión para club legal

Requisitos clave:
Área	Funcionalidad
Público	Actividades, productos, noticias (2 columnas), info membresía, redes sociales
Socios	Login, confirmar retiro (20g o 40g), fechas de entrega, historial
Admin	Gestionar solicitudes, noticias, productos, actividades, usuarios, notificaciones
Maestro	Mantenimiento completo, backups, logs
Notificaciones	WhatsApp: 4 días antes (último jueves), 2 días antes (primer jueves), límites 72/48hs
Datos socio	Nombre, apellido, cédula, teléfono (para WhatsApp)
2. REQUISITOS FUNCIONALES DETALLADOS
Módulo Público
Ver actividades del club

Ver productos cosechados

Novedades y noticias (formato periódico, 2 columnas)

Información de membresía (costos, cómo solicitar)

Accesos directos: Instagram, Telegram, WhatsApp, redes sociales

Módulo Socios (Área VIP)
Autenticación de socios registrados

Confirmar retiro mensual (opciones: 20g o 40g)

Ver fechas de entrega (último jueves y primer jueves)

Historial de retiros

Módulo Notificaciones
Recordatorio WhatsApp: 4 días antes del último jueves

Recordatorio WhatsApp: 2 días antes del primer jueves

Límite confirmación: 72hs antes (último jueves)

Límite confirmación: 48hs antes (primer jueves)

Módulo Administración
Recepcionar solicitudes de membresía

CRUD de noticias (con imágenes, orden cronológico inverso)

CRUD de productos cosechados

CRUD de actividades

Enviar notificaciones masivas a socios

Gestionar usuarios (aprobar/rechazar socios)

Módulo Maestro
Mantenimiento completo del sistema

Gestión de roles y permisos

Visualización de logs y backups

3. ESTRUCTURA DE BASE DE DATOS (SQL COMPLETO)
sql
-- ============================================
-- CLUB CURURÚ - ESQUEMA DE BASE DE DATOS
-- ============================================

-- 1. SOCIOS
CREATE TABLE socios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_socio INTEGER UNIQUE,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  cedula TEXT UNIQUE NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT,
  fecha_nacimiento DATE,
  direccion TEXT,
  fecha_ingreso DATE DEFAULT CURRENT_DATE,
  fecha_renovacion DATE,
  estado TEXT DEFAULT 'pendiente',
  activo BOOLEAN DEFAULT true,
  suspendido_hasta DATE,
  motivo_suspension TEXT,
  notificacion_whatsapp BOOLEAN DEFAULT true,
  notificacion_email BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. DOCUMENTACIÓN LEGAL
CREATE TABLE documentos_socios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id UUID REFERENCES socios(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  archivo_url TEXT NOT NULL,
  fecha_vencimiento DATE,
  verificado_por UUID,
  fecha_verificacion TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. LOTES DE COSECHA
CREATE TABLE lotes_cosecha (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_lote TEXT UNIQUE NOT NULL,
  cepa TEXT NOT NULL,
  fecha_cosecha DATE NOT NULL,
  cantidad_gramos_total INTEGER NOT NULL,
  cantidad_gramos_disponible INTEGER NOT NULL,
  thc_porcentaje DECIMAL(5,2),
  cbd_porcentaje DECIMAL(5,2),
  fecha_analisis DATE,
  archivo_analisis_url TEXT,
  estado TEXT DEFAULT 'disponible',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. RESERVAS MENSUALES
CREATE TABLE reservas_mensuales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id UUID REFERENCES socios(id) ON DELETE CASCADE,
  mes INTEGER NOT NULL,
  año INTEGER NOT NULL,
  cantidad_gramos INTEGER NOT NULL CHECK (cantidad_gramos IN (20, 40)),
  fecha_retiro DATE NOT NULL,
  tipo_entrega TEXT NOT NULL,
  fecha_confirmacion TIMESTAMP,
  estado TEXT DEFAULT 'pendiente',
  lote_id UUID REFERENCES lotes_cosecha(id),
  peso_real_entregado INTEGER,
  entregado_por UUID,
  fecha_entrega_real TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. NOTICIAS
CREATE TABLE noticias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  imagen_url TEXT,
  autor TEXT,
  fecha_publicacion TIMESTAMP DEFAULT NOW(),
  destacado BOOLEAN DEFAULT false,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. PRODUCTOS
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  imagen_url TEXT,
  cepa TEXT,
  thc_porcentaje DECIMAL(5,2),
  cbd_porcentaje DECIMAL(5,2),
  fecha_cosecha DATE,
  lote_id UUID REFERENCES lotes_cosecha(id),
  disponible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. ACTIVIDADES
CREATE TABLE actividades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha DATE NOT NULL,
  hora TIME,
  ubicacion TEXT,
  imagen_url TEXT,
  cupo_maximo INTEGER,
  cupos_disponibles INTEGER,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. SOLICITUDES DE MEMBRESÍA
CREATE TABLE solicitudes_membresia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  cedula TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT,
  mensaje TEXT,
  estado TEXT DEFAULT 'pendiente',
  fecha_solicitud TIMESTAMP DEFAULT NOW()
);

-- 9. NOTIFICACIONES PROGRAMADAS
CREATE TABLE notificaciones_programadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  socio_id UUID REFERENCES socios(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  fecha_programada TIMESTAMP NOT NULL,
  fecha_envio TIMESTAMP,
  estado TEXT DEFAULT 'pendiente',
  canal TEXT DEFAULT 'whatsapp',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 10. LOGS DE ACTIVIDAD
CREATE TABLE logs_actividad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID,
  usuario_tipo TEXT,
  accion TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  detalles JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 11. CONFIGURACIÓN DEL SISTEMA
CREATE TABLE configuracion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clave TEXT UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  descripcion TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insertar configuración por defecto
INSERT INTO configuracion (clave, valor, descripcion) VALUES
('limite_gramos_mensual', '40', 'Gramos máximos por socio al mes'),
('opciones_gramos', '20,40', 'Opciones de retiro disponibles'),
('dias_anticipacion_ultimo', '4', 'Días antes del último jueves para recordatorio'),
('dias_anticipacion_primer', '2', 'Días antes del primer jueves para recordatorio'),
('horas_limite_ultimo', '72', 'Horas antes del último jueves para confirmar'),
('horas_limite_primer', '48', 'Horas antes del primer jueves para confirmar');

-- 12. ÍNDICES
CREATE INDEX idx_socios_cedula ON socios(cedula);
CREATE INDEX idx_socios_estado ON socios(estado);
CREATE INDEX idx_reservas_socio ON reservas_mensuales(socio_id);
CREATE INDEX idx_reservas_fecha ON reservas_mensuales(fecha_retiro);
CREATE INDEX idx_noticias_fecha ON noticias(fecha_publicacion);
4. ROLES Y PERMISOS
Rol	Acceso	Permisos
Visitante	Público	Ver noticias, productos, actividades, solicitar membresía
Socio	/panel-socio	Confirmar reservas, ver historial, editar perfil
Administrador	/admin	Todo lo público + gestionar contenido, aprobar socios, notificaciones
Maestro	/maestro	Todo admin + gestionar admins, logs, configuración, backups
5. TECNOLOGÍAS UTILIZADAS
Componente	Tecnología	Costo
Frontend	HTML5, CSS3, JavaScript vanilla	Gratis
Backend / DB	Supabase (PostgreSQL + Auth)	Gratis (500MB DB)
Hosting	Vercel	Gratis
Notificaciones	WhatsApp Cloud API (Meta)	Gratis (hasta límites)
Control de versiones	GitHub	Gratis
Editor	VS Code	Gratis
6. ESTRUCTURA DE ARCHIVOS
text
cururu-club/
├── index.html              # Página pública
├── login.html              # Login de socios
├── panel-socio.html        # Panel del socio
├── admin.html              # Panel de administración
├── maestro.html            # Panel de maestro
├── css/
│   ├── style.css           # Estilos principales
│   └── responsive.css
├── js/
│   ├── supabase-client.js  # Configuración de Supabase
│   ├── auth.js             # Autenticación
│   ├── public.js           # Funciones públicas
│   ├── socio.js            # Panel socio
│   ├── admin.js            # Panel admin
│   └── notificaciones.js   # Sistema de WhatsApp
├── assets/
│   ├── images/
│   ├── icons/
│   └── logos/
└── funciones/
    └── whatsapp-webhook.js
7. CRONOGRAMA DE SESIONES
Sesión	Objetivo	Duración
1	Configurar Supabase, crear tablas, primera conexión	2-3 hs
2	Frontend público: HTML/CSS, 2 columnas, conexión a datos	3-4 hs
3	Autenticación: login con teléfono, panel socio básico	2-3 hs
4	Sistema de reservas: confirmación, validaciones, límites	3-4 hs
5	Panel admin: CRUD completo	4-5 hs
6	Gestión de socios: aprobar/rechazar, documentos	2-3 hs
7	Sistema de notificaciones: WhatsApp API, recordatorios	3-4 hs
8	Pruebas con usuarios reales, ajustes, despliegue	2-3 hs
Total estimado: 21-29 horas

8. CHECKLIST DE PREPARACIÓN DEL PC
Software a instalar:
text
[ ] Visual Studio Code (https://code.visualstudio.com/)
[ ] Node.js LTS (https://nodejs.org/)
[ ] Git (https://git-scm.com/)
[ ] Extensión Live Server en VS Code
[ ] Extensión Prettier en VS Code
[ ] Extensión Thunder Client en VS Code
Extensiones de VS Code necesarias:
Spanish Language Pack

Live Server

Prettier

ES7+ React/React-Native snippets

GitLens

Thunder Client

SQLite Viewer

Cuentas a crear:
text
[ ] GitHub (https://github.com/)
[ ] Supabase (https://supabase.com/)
[ ] Vercel (https://vercel.com/)
[ ] Meta for Developers (https://developers.facebook.com/)
Estructura de carpetas a crear:
bash
# Ejecutar en terminal:
cd ~/Desktop
mkdir cururu-club
cd cururu-club
mkdir css js assets funciones
mkdir assets/images assets/icons assets/logos
9. PREGUNTAS PENDIENTES PARA RESPONDER
Sobre el entorno:
¿Ya instalaste todo lo del checklist?

¿Qué sistema operativo usás? (Windows/Mac/Linux)

¿Tuviste algún problema con alguna instalación?

Sobre horarios:
Propuesta: Martes y Jueves de 19 a 22hs

¿Te sirve? ¿Qué horario prefieres?

Sobre el club:
¿El club ya existe legalmente o está en formación?

¿Tenés contacto con alguien del club para feedback?

¿Hay algún requisito legal especial que debamos considerar?

Sobre prioridades:
¿Qué funcionalidad es la MÁS CRÍTICA para el primer lanzamiento?

10. PALETA DE COLORES Y DISEÑO
Tema: Cururú (sapo) + flores de cannabis

Color	Código	Uso
Verde musgo	#4A5D23	Principal
Verde sapo	#8CB369	Secundario
Marrón tierra	#5E4B3C	Acentos
Crema	#F4EBD0	Fondo
Púrpura flor	#9B6A6C	Detalles
Tipografía:

Títulos: Poppins

Cuerpo: Open Sans

11. FUNCIONES CLAVE (Pseudo-código)
Cálculo de fechas de entrega:
javascript
const calcularFechasEntrega = (año, mes) => {
  const primerJueves = getPrimerJuevesDelMes(año, mes);
  const ultimoJueves = getUltimoJuevesDelMes(año, mes);
  return {
    primerJueves,
    ultimoJueves,
    limiteConfirmacionUltimo: restarHoras(ultimoJueves, 72),
    limiteConfirmacionPrimer: restarHoras(primerJueves, 48)
  };
};
Programación de recordatorios:
javascript
const programarRecordatorios = () => {
  // 4 días antes del último jueves
  const recordatorioUltimo = restarDias(ultimoJueves, 4);
  // 2 días antes del primer jueves
  const recordatorioPrimer = restarDias(primerJueves, 2);
};
📄 CÓMO CONVERTIR ESTO A PDF
Opción 1: Desde el navegador (más fácil)
Copiá TODO el texto desde el inicio hasta aquí

Pegalo en un documento de Google Docs o Word Online

Archivo → Descargar → PDF

Opción 2: Desde VS Code
Creá un archivo documentacion.md en tu proyecto

Pegá todo el contenido

Instalá la extensión "Markdown PDF"

Click derecho en el archivo → "Markdown PDF: Export (pdf)"

Opción 3: Print to PDF
Pegá el contenido en cualquier editor

Ctrl+P (Cmd+P en Mac)

Seleccioná "Guardar como PDF"

✅ CONFIRMACIÓN
Una vez que tengas este documento guardado en PDF, respondé:

"PDF listo"

Confirmá los puntos del Checklist

Decime qué horario te sirve para la primera sesión

Y arrancamos con la SESIÓN 1: Configuración de Supabase 🚀🐸🌿