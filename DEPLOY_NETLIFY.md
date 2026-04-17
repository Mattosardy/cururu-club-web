# Deploy Netlify + Supabase

## Estado actual

- El sitio puede publicarse como estatico en Netlify.
- La configuracion publica de Supabase vive en `js/runtime-config.js`.
- El entorno local de funciones vive en `supabase/.env.local`.
- WhatsApp queda desacoplado hasta cargar secretos reales de Twilio.

## Antes de publicar

1. Confirmar en `js/runtime-config.js`:
   - `supabaseUrl`
   - `supabasePublishableKey`
2. En Supabase production:
   - aplicar migraciones
   - desplegar `schedule-reminders`
   - desplegar `dispatch-whatsapp`
3. En Auth de Supabase:
   - agregar la URL final de Netlify en `site_url`
   - agregar redirects necesarios

## Deploy en Netlify

1. Crear un sitio nuevo desde esta carpeta o repo.
2. Publish directory: `.`
3. Build command: vacio
4. Verificar que Netlify publique `index.html`.

## Cuando toque activar WhatsApp

1. Cargar secretos en Supabase:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_FROM`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Desplegar o volver a desplegar las Edge Functions.
3. Habilitar cron para:
   - `schedule-reminders`
   - `dispatch-whatsapp`
4. Si queres reflejarlo en el frontend, cambiar `whatsappDispatchEnabled` a `true` en `js/runtime-config.js`.

## Archivo a editar segun entorno

- Produccion Netlify: `js/runtime-config.js`
- Ejemplo base: `js/runtime-config.example.js`
- Override local opcional: `js/runtime-config.local.js`
- Local functions: `supabase/.env.local`
