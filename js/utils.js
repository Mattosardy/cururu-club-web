function mostrarMensaje(mensaje, esExito = true) {
    const div = document.createElement('div');
    div.className = `mensaje-flotante ${esExito ? 'mensaje-exito' : 'mensaje-error'}`;
    div.innerHTML = `<i class="fas ${esExito ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${mensaje}`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 4000);
}

function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

function formatearTelefonoUruguay(telefono) {
    const limpio = String(telefono || '').replace(/[\s\-().]/g, '');
    if (limpio.startsWith('+598')) return limpio;
    if (limpio.startsWith('09') && limpio.length === 9) return `+598${limpio.slice(1)}`;
    if (limpio.startsWith('9') && limpio.length === 8) return `+598${limpio}`;
    if (limpio.length === 9) return `+598${limpio}`;
    return limpio;
}

function calcularFechasEntrega() {
    const hoy = new Date();
    let anio = hoy.getFullYear();
    let mes = hoy.getMonth();
    let primerJueves = new Date(anio, mes, 1);
    while (primerJueves.getDay() !== 4) primerJueves.setDate(primerJueves.getDate() + 1);
    if (primerJueves < hoy) {
        mes += 1;
        if (mes > 11) {
            mes = 0;
            anio += 1;
        }
        primerJueves = new Date(anio, mes, 1);
        while (primerJueves.getDay() !== 4) primerJueves.setDate(primerJueves.getDate() + 1);
    }
    const ultimoJueves = new Date(anio, mes + 1, 0);
    while (ultimoJueves.getDay() !== 4) ultimoJueves.setDate(ultimoJueves.getDate() - 1);
    return { primerJueves, ultimoJueves };
}

function puedeConfirmar(fechaEntrega, horasLimite) {
    const ahora = new Date();
    const fechaLimite = new Date(fechaEntrega.getTime() - horasLimite * 60 * 60 * 1000);
    return ahora <= fechaLimite;
}

function normalizarFechaSinHora(fecha) {
    const valor = new Date(fecha);
    valor.setHours(0, 0, 0, 0);
    return valor;
}

function obtenerUltimoJuevesDelMes(anio, mes) {
    const ultimoDia = new Date(anio, mes + 1, 0);
    ultimoDia.setHours(0, 0, 0, 0);
    while (ultimoDia.getDay() !== 4) ultimoDia.setDate(ultimoDia.getDate() - 1);
    return ultimoDia;
}

function formatearFechaClave(fecha) {
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

function obtenerCicloClub(fechaReferencia = new Date()) {
    const referencia = normalizarFechaSinHora(fechaReferencia);
    const ultimoJuevesMesActual = obtenerUltimoJuevesDelMes(referencia.getFullYear(), referencia.getMonth());

    let inicio;
    if (referencia >= ultimoJuevesMesActual) {
        inicio = ultimoJuevesMesActual;
    } else {
        const fechaMesAnterior = new Date(referencia.getFullYear(), referencia.getMonth() - 1, 1);
        inicio = obtenerUltimoJuevesDelMes(fechaMesAnterior.getFullYear(), fechaMesAnterior.getMonth());
    }

    const siguienteInicio = obtenerUltimoJuevesDelMes(inicio.getFullYear(), inicio.getMonth() + 1);
    const fin = new Date(siguienteInicio);
    fin.setDate(fin.getDate() - 1);
    fin.setHours(23, 59, 59, 999);

    return {
        inicio,
        fin,
        clave: `${formatearFechaClave(inicio)}_${formatearFechaClave(normalizarFechaSinHora(fin))}`,
        etiqueta: `${inicio.toLocaleDateString('es-UY')} al ${normalizarFechaSinHora(fin).toLocaleDateString('es-UY')}`
    };
}

function fechaEstaEnCicloClub(fecha, ciclo = obtenerCicloClub()) {
    if (!fecha) return false;
    const valor = new Date(fecha);
    return valor >= ciclo.inicio && valor <= ciclo.fin;
}

function obtenerClaveMesActual() {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
}

function obtenerIdentificadorSocioPedido() {
    if (appState.socioData?.id) return appState.socioData.id;
    if (appState.socioData?.email) return appState.socioData.email;
    if (appState.usuarioActual?.email) return appState.usuarioActual.email;
    return 'invitado';
}

function obtenerImagenFallback(producto) {
    const nombre = String(producto?.nombre || '').toLowerCase();
    if (nombre.includes('cururu')) return 'assets/images/cururu-dream.jpg';
    if (nombre.includes('sapo')) return 'assets/images/sapo-kush.jpg';
    if (nombre.includes('rana')) return 'assets/images/rana-verde.jpg';
    return 'assets/images/cururu-dream.jpg';
}

function esRutaLocalInvalida(valor) {
    const ruta = String(valor || '').trim().toLowerCase();
    if (!ruta) return true;
    if (ruta.startsWith('file:///')) return true;
    if (/^[a-z]:[\\/]/.test(ruta)) return true;
    return false;
}

function crearPlaceholderConstruccion(titulo = 'Sitio en construcción', detalle = 'Contenido visual en preparación') {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
            <defs>
                <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#102015"/>
                    <stop offset="100%" stop-color="#27402a"/>
                </linearGradient>
            </defs>
            <rect width="1200" height="800" fill="url(#bg)"/>
            <rect x="70" y="70" width="1060" height="660" rx="36" fill="rgba(8,15,6,0.55)" stroke="#7ca35a" stroke-width="4"/>
            <text x="600" y="340" fill="#8fb86a" font-family="Poppins, Arial, sans-serif" font-size="54" font-weight="700" text-anchor="middle">${titulo}</text>
            <text x="600" y="410" fill="#dce8cf" font-family="Open Sans, Arial, sans-serif" font-size="30" text-anchor="middle">${detalle}</text>
        </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.replace(/\n\s+/g, ' ').trim())}`;
}

function normalizarListaImagenes(valor) {
    if (!valor) return [];
    if (Array.isArray(valor)) {
        return valor
            .map((item) => String(item || '').trim())
            .filter((item) => item && !esRutaLocalInvalida(item));
    }
    if (typeof valor === 'string') {
        const limpio = valor.trim();
        if (!limpio || esRutaLocalInvalida(limpio)) return [];
        if (limpio.startsWith('[')) {
            try {
                const parseado = JSON.parse(limpio);
                if (Array.isArray(parseado)) {
                    return parseado
                        .map((item) => String(item || '').trim())
                        .filter((item) => item && !esRutaLocalInvalida(item));
                }
            } catch (error) {
                console.warn('No se pudo parsear la galeria de imagenes', error);
            }
        }
        return [limpio];
    }
    return [];
}

function obtenerImagenPrincipal(listaImagenes = [], titulo = 'Sitio en construcción') {
    return listaImagenes[0] || crearPlaceholderConstruccion(titulo);
}

function construirHTMLGaleriaHorizontal(imagenes, opciones = {}) {
    const {
        imagenPrincipalId = 'galeriaImagenPrincipal',
        stripClass = 'galeria-strip',
        thumbClass = 'galeria-thumb',
        onSelect = 'void(0)',
        titulo = 'Sitio en construcción'
    } = opciones;

    const lista = normalizarListaImagenes(imagenes);
    const imagenesFinales = lista.length ? lista : [crearPlaceholderConstruccion(titulo)];

    return `
        <div class="modal-galeria horizontal">
            <img id="${imagenPrincipalId}" class="modal-imagen" src="${imagenesFinales[0]}" alt="${escapeHtml(titulo)}">
            <div class="${stripClass}">
                ${imagenesFinales.map((imagen, index) => `
                    <button
                        type="button"
                        class="${thumbClass}${index === 0 ? ' activa' : ''}"
                        onclick="${onSelect}(${index})"
                    >
                        <img src="${imagen}" alt="${escapeHtml(`${titulo} ${index + 1}`)}">
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function aplicarContenidoInstitucional(configMap = {}) {
    const historiaPrincipal = document.querySelector('.historia-texto > p');
    if (historiaPrincipal && configMap.historia_texto) {
        historiaPrincipal.innerHTML = `<strong>Cururu Club</strong> ${escapeHtml(configMap.historia_texto)}`;
    }

    const cifraSocios = document.getElementById('cifra-socios');
    const cifraCepas = document.getElementById('cifra-cepas');
    const cifraAnios = document.getElementById('cifra-anios');
    if (cifraSocios && configMap.cifra_socios) cifraSocios.textContent = `+${configMap.cifra_socios}`;
    if (cifraCepas && configMap.cifra_cepas) cifraCepas.textContent = `${configMap.cifra_cepas}+`;
    if (cifraAnios && configMap.cifra_anios) cifraAnios.textContent = configMap.cifra_anios;

    const historiaMedia = document.getElementById('historiaMediaPrincipal');
    const historiaGaleria = document.getElementById('historiaGaleria');
    if (historiaMedia && historiaGaleria) {
        const imagenesHistoria = normalizarListaImagenes(configMap.historia_galeria);
        const videoHistoria = String(configMap.historia_video_url || '').trim();
        if (imagenesHistoria.length) {
            const imagenPrincipal = obtenerImagenPrincipal(imagenesHistoria, 'Sitio en construcción');
            historiaMedia.innerHTML = `
                <img
                    src="${imagenPrincipal}"
                    alt="Historia Cururu Club"
                    style="width: 100%; max-height: 300px; border-radius: 16px; object-fit: cover;"
                    onerror="this.onerror=null; this.src='${crearPlaceholderConstruccion('Sitio en construcción')}';"
                >
            `;
        } else if (videoHistoria) {
            historiaMedia.innerHTML = `
                <video autoplay muted loop playsinline controls style="width: 100%; max-height: 300px; border-radius: 16px; object-fit: cover;">
                    <source src="${videoHistoria}">
                    Tu navegador no soporta videos.
                </video>
            `;
        } else {
            historiaMedia.innerHTML = `
                <video autoplay muted loop playsinline style="width: 100%; max-height: 300px; border-radius: 16px; object-fit: cover;">
                    <source src="assets/images/cururu-video.mp4" type="video/mp4">
                    Tu navegador no soporta videos.
                </video>
            `;
        }
        if (imagenesHistoria.length > 1) {
            historiaGaleria.style.display = 'grid';
            historiaGaleria.innerHTML = imagenesHistoria.map((imagen, index) => `
                <button
                    type="button"
                    class="historia-galeria-item${index === 0 ? ' activa' : ''}"
                    onclick="seleccionarHistoriaImagen(${index})"
                >
                    <img src="${imagen}" alt="Historia ${index + 1}" onerror="this.onerror=null; this.src='${crearPlaceholderConstruccion('Sitio en construcción')}';">
                </button>
            `).join('');
            appState.historiaGaleria = imagenesHistoria;
        } else {
            historiaGaleria.style.display = 'none';
            historiaGaleria.innerHTML = '';
            appState.historiaGaleria = imagenesHistoria;
        }
    }
}

function inicializarPlaceholders() {
    if (localStorage.getItem('cururu_placeholders')) return;
    const images = {
        'cururu-dream': { color: '#2d5a27', text: 'Cururu Dream' },
        'sapo-kush': { color: '#3a6b2d', text: 'Sapo Kush' },
        'rana-verde': { color: '#4a7a3a', text: 'Rana Verde' },
        'red-pop': { color: '#8b3a3a', text: 'Red Pop' }
    };
    const placeholders = {};
    Object.entries(images).forEach(([name, config]) => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = config.color;
        ctx.fillRect(0, 0, 400, 300);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Poppins, Arial';
        ctx.textAlign = 'center';
        ctx.fillText(config.text, 200, 140);
        ctx.font = '14px Poppins, Arial';
        ctx.fillStyle = '#a0b890';
        ctx.fillText('Cururu Club', 200, 170);
        placeholders[name] = canvas.toDataURL('image/jpeg', 0.9);
    });
    localStorage.setItem('cururu_placeholders', JSON.stringify(placeholders));
}

console.log('Utils loaded');

window.crearPlaceholderConstruccion = crearPlaceholderConstruccion;
window.normalizarListaImagenes = normalizarListaImagenes;
window.obtenerImagenPrincipal = obtenerImagenPrincipal;
window.construirHTMLGaleriaHorizontal = construirHTMLGaleriaHorizontal;
window.obtenerCicloClub = obtenerCicloClub;
window.fechaEstaEnCicloClub = fechaEstaEnCicloClub;
window.seleccionarHistoriaImagen = function(indice) {
    const historiaMedia = document.getElementById('historiaMediaPrincipal');
    if (!historiaMedia || !Array.isArray(appState.historiaGaleria) || !appState.historiaGaleria[indice]) return;
    const imagen = appState.historiaGaleria[indice];
    historiaMedia.innerHTML = `
        <img
            src="${imagen}"
            alt="Historia Cururu Club"
            style="width: 100%; max-height: 300px; border-radius: 16px; object-fit: cover;"
            onerror="this.onerror=null; this.src='${crearPlaceholderConstruccion('Sitio en construcción')}';"
        >
    `;
    document.querySelectorAll('.historia-galeria-item').forEach((item, itemIndex) => {
        item.classList.toggle('activa', itemIndex === indice);
    });
};
