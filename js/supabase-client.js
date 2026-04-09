// ============================================
// SUPABASE CLIENT - CURURÚ CLUB
// VERSIÓN CON LOGIN POR EMAIL
// ============================================

const SUPABASE_URL = 'https://qjiqbcokhlwisxbeplym.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqaXFiY29raGx3aXN4YmVwbHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2OTc3MjgsImV4cCI6MjA5MDI3MzcyOH0._bRZjYV1Ly30T-g4zuI7GNNTRnZtnD9HTamojbP3xnY';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// PRUEBA DE CONEXIÓN
// ============================================

async function testConexion() {
    console.log('🔌 Probando conexión con Supabase...');
    
    try {
        const { data, error } = await supabaseClient
            .from('noticias')
            .select('*')
            .limit(3);
        
        if (error) throw error;
        
        console.log('✅ Conexión exitosa!');
        console.log('📰 Noticias:', data);
        return true;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return false;
    }
}

// ============================================
// FUNCIONES PÚBLICAS
// ============================================

async function obtenerNoticias() {
    try {
        const { data, error } = await supabaseClient
            .from('noticias')
            .select('*')
            .order('fecha_publicacion', { ascending: false });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error en noticias:', error.message);
        return [];
    }
}

async function obtenerProductos() {
    try {
        const { data, error } = await supabaseClient
            .from('productos')
            .select('*');
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error en productos:', error.message);
        return [];
    }
}

async function obtenerActividades() {
    try {
        const { data, error } = await supabaseClient
            .from('actividades')
            .select('*')
            .order('fecha', { ascending: true });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error en actividades:', error.message);
        return [];
    }
}

async function solicitarMembresia(datos) {
    try {
        const { data, error } = await supabaseClient
            .from('solicitudes_membresia')
            .insert([{
                nombre: datos.nombre,
                apellido: datos.apellido,
                cedula: datos.cedula,
                telefono: datos.telefono,
                email: datos.email || null,
                mensaje: datos.mensaje || null
            }]);
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, error: error.message };
    }
}

// ============================================
// AUTENTICACIÓN CON EMAIL (NUEVO)
// ============================================

// Login con Email (envía código OTP)
async function loginConEmail(email) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithOtp({
            email: email,
        });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error al enviar código por email:', error.message);
        return { success: false, error };
    }
}

// Verificar código de Email
async function verificarEmail(email, codigo) {
    try {
        const { data, error } = await supabaseClient.auth.verifyOtp({
            email: email,
            token: codigo,
            type: 'email'
        });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error al verificar código:', error.message);
        return { success: false, error };
    }
}

// Obtener usuario actual (sesión activa)
async function obtenerUsuarioActual() {
    try {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.error('Error al obtener usuario:', error.message);
        return null;
    }
}

// Cerrar sesión
async function cerrarSesion() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error al cerrar sesión:', error.message);
        return { success: false, error: error.message };
    }
}

// ============================================
// FUNCIONES PARA SOCIOS (PANEL)
// ============================================

// Obtener socio por email
async function obtenerSocioPorEmail(email) {
    try {
        const { data, error } = await supabaseClient
            .from('socios')
            .select('*')
            .eq('email', email)
            .single();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error al obtener socio:', error.message);
        return { success: false, error: error.message };
    }
}

// Obtener reservas de un socio
async function obtenerReservas(socioId) {
    try {
        const { data, error } = await supabaseClient
            .from('reservas_mensuales')
            .select('*')
            .eq('socio_id', socioId)
            .order('fecha_retiro', { ascending: false });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error al obtener reservas:', error.message);
        return [];
    }
}

// Confirmar reserva
async function confirmarReserva(socioId, gramos, tipo, fechaRetiro) {
    try {
        const hoy = new Date();
        const reserva = {
            socio_id: socioId,
            mes: hoy.getMonth() + 1,
            año: hoy.getFullYear(),
            cantidad_gramos: gramos,
            fecha_retiro: fechaRetiro,
            tipo_entrega: tipo === 'primer' ? 'primer_jueves' : 'ultimo_jueves',
            fecha_confirmacion: new Date(),
            estado: 'confirmado'
        };
        
        const { data, error } = await supabaseClient
            .from('reservas_mensuales')
            .insert([reserva]);
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error al confirmar reserva:', error.message);
        return { success: false, message: error.message };
    }
}

// ============================================
// AUTENTICACIÓN CON WHATSAPP (MANTENIDA)
// ============================================

async function loginConWhatsapp(telefono) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithOtp({
            phone: telefono,
        });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, error: error.message };
    }
}

async function verificarCodigo(telefono, codigo) {
    try {
        const { data, error } = await supabaseClient.auth.verifyOtp({
            phone: telefono,
            token: codigo,
            type: 'sms'
        });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error:', error.message);
        return { success: false, error: error.message };
    }
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================

// Funciones públicas
window.supabaseClient = supabaseClient;
window.testConexion = testConexion;
window.obtenerNoticias = obtenerNoticias;
window.obtenerProductos = obtenerProductos;
window.obtenerActividades = obtenerActividades;
window.solicitarMembresia = solicitarMembresia;

// Autenticación email (NUEVAS)
window.loginConEmail = loginConEmail;
window.verificarEmail = verificarEmail;
window.obtenerUsuarioActual = obtenerUsuarioActual;
window.cerrarSesion = cerrarSesion;

// Funciones para socio
window.obtenerSocioPorEmail = obtenerSocioPorEmail;
window.obtenerReservas = obtenerReservas;
window.confirmarReserva = confirmarReserva;

// Autenticación WhatsApp (mantenida)
window.loginConWhatsapp = loginConWhatsapp;
window.verificarCodigo = verificarCodigo;

console.log('🚀 Cururú Club - Client listo (con login por email)');