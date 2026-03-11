// =================================================================================
// Inicialización del mapa, configuración de plantilla y marcadores personalizados. 
// =================================================================================

// Seteamos la vista centrada en malaga. ([latitud, longitud], zoom)
const miMapa = L.map('map').setView([36.72016, -4.42034], 14);

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


// ========================================
// Variables de estado y elementos del DOM 
// ========================================
const btnAparcar = document.querySelector('#btn-aparcar');
const mapOverLay = document.querySelector('#map-overlay');

let marcadorCoche = null; // variable para almacenar el marcador del coche
let aparcado = false; // variable para controlar si el coche ya está aparcado


// ================================================
// Funciones para actualizar la interfaz y estado. 
// ================================================


/**
 * Oculta el overlayborroso y actualiza el diseño del botón cuando el coche esta aparcado.
 * Cambia el estado del vehiculo aparcado=true
*/
function actualizarInterfazAparcado() {

    mapOverLay.classList.add('hidden');
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
    btnAparcar.disabled = false;
    btnAparcar.textContent = "Aparcar Aquí";
    btnAparcar.className = "w-full bg-brand-primary text-white py-4 rounded-2xl shadow-xl font-bold text-lg flex items-center justify-center gap-2 active:bg-brand-secondary transition-colors disabled:opacity-70 disabled:cursor-not-allowed";
    aparcado = false;

};

// ==========================================================================
// Funciones para manejar lógica de alamcenamiento y mapas. 
// ==========================================================================

/**
 * Establece el marcador del coche dada la ubicación porporcionada por la geoLocation o por  LocalStorage.
 * Guarda la ubicación en localStorage si no tenemos aparcamiento en curso.
*/
function establacerAparcamiento (latitud, longitud, guardarEnLocalStorage = false) {

    miMapa.setView([latitud, longitud], 18);

    if (marcadorCoche) {
        marcadorCoche.setLatLng([latitud, longitud]);
    } else {
        marcadorCoche = L.marker([latitud, longitud], {icon: iconoCoche}).addTo(miMapa);
    }

    marcadorCoche.bindPopup("Vehículo aparcado").openPopup();

    actualizarInterfazAparcado();

    if (guardarEnLocalStorage) {

        const datosAparcamiento = {
            latitud: latitud,
            longitud: longitud,
            timestamp : Date.now()
        };

        localStorage.setItem('aparcamientoEnCurso', JSON.stringify(datosAparcamiento));
    }
};

/**
 * Elimina el marcador del coche en el mapa, setea la vista genérica del mapa
 * y elimina el aparcamiento en curso del localStorage. 
*/
function limpiarAparcamiento() {

    if (marcadorCoche) {

        miMapa.removeLayer(marcadorCoche);
        marcadorCoche = null;

    }
    miMapa.setView([36.72016, -4.42034], 14); // volvemos a la vista genérica del mapa

    actualizarInterfazNoAparcado();
    localStorage.removeItem('aparcamientoEnCurso'); // eliminamos el aparcamiento en curso del localStorage

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

            establacerAparcamiento(posicion.coords.latitude, posicion.coords.longitude, true);

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

// ===================================================================
// Inicializacion al cargar la página. (no hay aparcamiento en curso) 
// ===================================================================
const parkingGuardadoEnCurso = localStorage.getItem('aparcamientoEnCurso');
if (parkingGuardadoEnCurso) {
    const datosAparcamiento = JSON.parse(parkingGuardadoEnCurso);
    establacerAparcamiento(datosAparcamiento.latitud, datosAparcamiento.longitud, false);
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
