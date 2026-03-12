// =================================================================================
// Inicialización del mapa, configuración de plantilla y marcadores personalizados. 
// =================================================================================

// Seteamos la vista centrada en malaga. ([latitud, longitud], zoom)
const miMapa = L.map('map', {
    zoomControl: false, // desactivamos el +- del zoom para cambiarlo de posicion
}).setView([36.72016, -4.42034], 14);

// Movemos el control de zoom a la esquina superior derecha
L.control.zoom({
    position: 'topright'
}).addTo(miMapa);

// Plantilla de mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap' // Atribución requerida por OpenStreetMap
}).addTo(miMapa);

// marcador personalizado para el coche aparcado
const iconoCoche = L.icon({
    iconUrl : '/images/coche.svg',
    iconSize : [40, 40],
    iconAnchor : [20, 40],
    popupAnchor : [0, -40]
})

// marcador personalizado ubicacion del usuario
const iconoUsuario = L.icon({
    iconUrl : '/images/usuario.svg',
    iconSize : [30, 30],
    iconAnchor : [15, 30],
    popupAnchor : [0, -30]
})


// ========================================
// Variables de estado y elementos del DOM 
// ========================================
const btnAparcar = document.querySelector('#btn-aparcar');
const mapOverLay = document.querySelector('#map-overlay');
const panelInfo = document.querySelector('#panel-info');
const infoDistancia = document.querySelector('#info-distancia');
const infoTiempo = document.querySelector('#info-tiempo');

let marcadorCoche = null; // variable para almacenar el marcador del coche
let marcadorUsuario = null; // variable para almacenar el marcador del usuario
let aparcado = false; // variable para controlar si el coche ya está aparcado
let seguimientoUsuario = null; // variable para controlar el seguimiento del usuario
let intervaloActualizacion = null; // variable para controlar el intervalo de actualización del tiempo
let horaAparcamiento = null; // variable para almacenar la hora de inicio del aparcamiento


// ================================================
// Funciones para actualizar la interfaz y estado. 
// ================================================


/**
 * Oculta el overlayborroso y actualiza el diseño del botón cuando el coche esta aparcado.
 * Cambia el estado del vehiculo aparcado=true
*/
function actualizarInterfazAparcado() {

    mapOverLay.classList.add('hidden');
    panelInfo.classList.remove('hidden');
    btnAparcar.disabled = false;
    btnAparcar.textContent = "Finalizar Aparcamiento";
    btnAparcar.className = "w-full bg-emerald-400 text-white py-4 rounded-2xl shadow-xl font-bold text-lg flex items-center justify-center gap-2 active:bg-emerald-500 transition-colors";
    aparcado = true;

};

/**
 * Muestra el overlay borroso y actualiza el diseño del botón cuando el coche no está aparcado.
 * Cambia el estado del vehiculo aparcado=false
*/
function actualizarInterfazNoAparcado() {

    mapOverLay.classList.remove('hidden');
    panelInfo.classList.add('hidden');
    btnAparcar.disabled = false;
    btnAparcar.textContent = "Aparcar Aquí";
    btnAparcar.className = "w-full bg-brand-primary text-white py-4 rounded-2xl shadow-xl font-bold text-lg flex items-center justify-center gap-2 active:bg-brand-secondary transition-colors disabled:opacity-70 disabled:cursor-not-allowed";
    aparcado = false;

};

// ==========================================================================
// Funciones para manejar lógica de alamcenamiento y mapas. 
// ==========================================================================

/**
 * Establece el marcador del coche dada la ubicación porporcionada por la geoLocation o por LocalStorage.
 * Inicializa el reloj de aparcamiento y el seguimiento del usuario para mostrar su ubicación en el mapa.
 * Guarda la ubicación en localStorage si no tenemos aparcamiento en curso.
*/
function establacerAparcamiento (latitud, longitud, guardarEnLocalStorage = false, tiempoAparcamiento = Date.now()) {

    miMapa.setView([latitud, longitud], 18);

    if (marcadorCoche) {
        marcadorCoche.setLatLng([latitud, longitud]);
    } else {
        marcadorCoche = L.marker([latitud, longitud], {icon: iconoCoche}).addTo(miMapa);
    }

    marcadorCoche.bindPopup("Vehículo aparcado").openPopup();

    actualizarInterfazAparcado();
    iniciarRelojAparcamiento(tiempoAparcamiento); 

    if (guardarEnLocalStorage) {

        const datosAparcamiento = {
            latitud: latitud,
            longitud: longitud,
            timestamp : Date.now()
        };

        localStorage.setItem('aparcamientoEnCurso', JSON.stringify(datosAparcamiento));
    }

    iniciarSeguimiento(); // Iniciamos el seguimiento del usuario para mostrar su ubicación en el mapa

};

/**
 * Elimina el marcador del coche en el mapa, setea la vista genérica del mapa
 * y elimina el aparcamiento en curso del localStorage. 
*/
function limpiarAparcamiento() {

    const parkingGuardadoEnCurso = localStorage.getItem('aparcamientoEnCurso');
    if (parkingGuardadoEnCurso) {
        const datosAparcamiento = JSON.parse(parkingGuardadoEnCurso);
        guardarHistorialLocalStorage(datosAparcamiento); // guardamos el aparcamiento finalizado en el historial del localStorag
    }

    if (marcadorCoche) {

        miMapa.removeLayer(marcadorCoche);
        marcadorCoche = null;

    }

    if (seguimientoUsuario !== null) {

        navigator.geolocation.clearWatch(seguimientoUsuario); // Detenemos el seguimiento del usuario
        seguimientoUsuario = null;

    }

    if (marcadorUsuario) {

        miMapa.removeLayer(marcadorUsuario);
        marcadorUsuario = null;

    }

    miMapa.setView([36.72016, -4.42034], 14); // volvemos a la vista genérica del mapa

    actualizarInterfazNoAparcado();
    detenerRelojAparcamiento();
    localStorage.removeItem('aparcamientoEnCurso'); // eliminamos el aparcamiento en curso del localStorage

}

/**
 * Calcula el tiempo transcurrido desde que se inicio el seguimiento 
 * hasta cada vez que se ejecuta esta función. 
*/
function calcularYMostrarTiempo() {

    if (!horaAparcamiento) return;

    const horaActual = Date.now(); // hora exacta en el momento actual
    const diferenciaMs = horaActual - horaAparcamiento;

    const minutos = Math.floor(diferenciaMs / 60000); // convertimos la diferencia a minutos

    infoTiempo.textContent = minutos + " min";

}

/**
 * Inicia el intervalo para calcular y mostrar el tiempo transcurrido 
*/
function iniciarRelojAparcamiento(tiempoInicial) {

    horaAparcamiento = tiempoInicial;

    calcularYMostrarTiempo(); // calculamos el tiempo inmediatamente para mostrarlo sin esperar al primer intervalo

    intervaloActualizacion = setInterval(calcularYMostrarTiempo, 60000); // actualizamos el tiempo cada 60segundos

}

/**
 * Apaga el contandor y resetea el tiempo de aparcamiento 
*/
function detenerRelojAparcamiento() {

    if (intervaloActualizacion) {
        clearInterval(intervaloActualizacion);
        intervaloActualizacion = null;
    }

    horaAparcamiento = null;
    infoTiempo.textContent = "-- min";

}

/**
 * Guarda los aparacamientos finalizados en loclalStorge en un array
 * para mostrar un historial de aparcamientos.
*/
function guardarHistorialLocalStorage(datosAparcamiento) {

    const historialAparcamientos = localStorage.getItem('historialAparcamientos');
    let historial = [];

    if (historialAparcamientos) {
        historial = JSON.parse(historialAparcamientos);
    }

    // calculo del tiempo de aparcamiento en minutos
    const ahora = Date.now();
    const tiempoAparcamientoMinutos = Math.round((ahora - datosAparcamiento.timestamp) / 60000);

    const registroAparcamiento = {
        id : ahora, // ID unico.
        latitud : datosAparcamiento.latitud,
        longitud : datosAparcamiento.longitud,
        inicio : datosAparcamiento.timestamp,
        fin : ahora,
        tiempoTotalMinutos : tiempoAparcamientoMinutos
    }

    historial.unshift(registroAparcamiento); // añadimos el nuevo registro al inicio del array

    localStorage.setItem('historialAparcamientos', JSON.stringify(historial));
}

// ==================================================
// Funciones para manejar geolocalizacion y alertas.  
// ==================================================

/**
 * Muestra alerta de confirmacion para finalizar seguimiento del coche aparcado.
 * Si confirma limpia el aparcamiento 
*/
function finalizarAparcamiento() {

    Swal.fire({
        title : '¿Finalizar seguimiento?',
        text : 'Dejaremos de seguir la ubicación de tu coche, ¿estás seguro?',
        icon : 'question',
        showCancelButton : true,
        confirmButtonColor : '#627FD9',
        cancelButtonColor : '#d33',
        confirmButtonText : 'Sí, finalizar',
        cancelButtonText : 'No, seguir aparcado'
    }).then((result) => {

        if (result.isConfirmed) {
            limpiarAparcamiento();
        }
    });

}

/**
 * Obtiene la ubicación actual que amrca el aparcamiento, establece el marcador del coche,
 * y muestra alertas de error si no se puede obtener la ubicacin.
*/
function iniciarAparcamiento() {

    btnAparcar.disabled = true;
    btnAparcar.textContent = "Localizando...";

    if (!("geolocation" in navigator)) {

        Swal.fire({ 
            icon: 'warning',
            title: 'Navegador no compatible',
            text: 'Tu navegador no soporta geolocalización.',
            confirmButtonColor: '#627FD9'
        });
        actualizarInterfazNoAparcado();
        return;
    }

    navigator.geolocation.getCurrentPosition(

        (posicion) => {

            establacerAparcamiento(posicion.coords.latitude, posicion.coords.longitude, true, Date.now() );

        },
        (error) => {

            console.error("Error al obtener la geolocalización: ", error);
            Swal.fire({
                icon: 'error',
                title: '¡Ubicacion no disponible!',
                text: 'No se pudo obtener tu ubicación. Asegúrate de tener el GPS activado.',
                confirmButtonColor: '#627FD9'
            });
            actualizarInterfazNoAparcado();

        },
        {  
            enableHighAccuracy: true, 
            timeout: 5000
        }
    );

}

function iniciarSeguimiento() {

    if (seguimientoUsuario !== null) return // ya estamos siguiendo al usuario

    if ("geolocation" in navigator) {

        // watchPosition devuelve un ID con el que podemos controlar el seguimiento.
        seguimientoUsuario = navigator.geolocation.watchPosition(

            (posicion) => {

                const latitud = posicion.coords.latitude;
                const longitud = posicion.coords.longitude;

                // Si el marcador del usuario no existe, lo creamos. Si ya existe, actualizamos su posición.
                if (!marcadorUsuario) {

                    marcadorUsuario = L.marker([latitud, longitud], {icon: iconoUsuario}).addTo(miMapa);
                    marcadorUsuario.bindPopup("Tu ubicación actual").openPopup();

                } else {
                    
                    marcadorUsuario.setLatLng([latitud, longitud]);

                }

                // Calculamos la distancia entre el usuario y el coche
                if (marcadorCoche) {

                    const ubicacionUsuario = L.latLng(latitud, longitud);
                    const ubicacionCoche = marcadorCoche.getLatLng();

                    const distanciaMetros = Math.round(ubicacionUsuario.distanceTo(ubicacionCoche));

                    if (distanciaMetros > 1000) {
                        infoDistancia.textContent = (distanciaMetros/1000).toFixed(2) + " km";
                    } else {
                        infoDistancia.textContent = distanciaMetros + " m";
                    }

                }

            },
            (error) => {
                console.error("Error al obtener la geolocalización: ", error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 10000, // Permite usar una posición en caché de hasta 10 segundos
            }

        );

    }

}

// ===================================================================
// Inicializacion al cargar la página. (no hay aparcamiento en curso) 
// ===================================================================
const parkingGuardadoEnCurso = localStorage.getItem('aparcamientoEnCurso');
if (parkingGuardadoEnCurso) {
    const datosAparcamiento = JSON.parse(parkingGuardadoEnCurso);
    establacerAparcamiento(datosAparcamiento.latitud, datosAparcamiento.longitud, false, datosAparcamiento.timestamp);
    iniciarSeguimiento(); // aunque el seguimiento ya se llama en la funcion establacerAparcamiento, lo llamamos aquí para asegurarnos de que se inicie el seguimiento si recargamos la página con un aparcamiento en curso.
}

// =====================
// Manejador de eventos 
// =====================
btnAparcar.addEventListener('click', () => {

    if (aparcado) {
        finalizarAparcamiento();
    } else {
        iniciarAparcamiento();
    }
});
