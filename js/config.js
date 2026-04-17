// Runtime configuration shared by the front-end app.
window.CURURU_DEFAULT_RUNTIME_CONFIG = {
    supabaseUrl: 'https://qjiqbcokhlwisxbeplym.supabase.co',
    supabasePublishableKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqaXFiY29raGx3aXN4YmVwbHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2OTc3MjgsImV4cCI6MjA5MDI3MzcyOH0._bRZjYV1Ly30T-g4zuI7GNNTRnZtnD9HTamojbP3xnY',
    localSupabaseUrl: 'http://127.0.0.1:54321',
    localSupabasePublishableKey: 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH',
    siteMode: 'production',
    whatsappDispatchEnabled: false,
    scheduleRemindersFunction: 'schedule-reminders',
    dispatchWhatsappFunction: 'dispatch-whatsapp'
};

window.CURURU_RUNTIME_CONFIG = Object.assign(
    {},
    window.CURURU_DEFAULT_RUNTIME_CONFIG,
    window.CURURU_RUNTIME_CONFIG || {}
);

// Global shared state for the front-end app.
window.configSistema = {
    horasLimitePrimer: 48,
    horasLimiteUltimo: 72
};

window.appState = {
    usuarioActual: null,
    rolUsuario: 'invitado',
    socioData: null,
    fechasEntrega: null,
    productoEditandoId: null,
    productoModalActual: null,
    gramosSeleccionadosPedido: null,
    galeriaActual: { imagenes: [], indice: 0, productoId: null },
    historiaGaleria: [],
    noticiaGaleriaActual: { imagenes: [], indice: 0 },
    reservasChart: null,
    sociosChart: null,
    configWhatsApp: { phoneNumberId: null, accessToken: null }
};

console.log('Config loaded');
