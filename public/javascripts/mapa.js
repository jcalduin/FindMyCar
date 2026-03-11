/**
 * Inicializamos el mapa y seteamos la vista en malaga como punto genérico
 * [latitud, longitud] , zoom 
*/
const miMapa = L.map('map').setView([36.72016, -4.42034], 14);

// Añadimos la plantilla, es decir las imagenes que provocan el efecto de mapa, en este caso usamos OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(miMapa);

// Creamos un icono personalizado para el marcador del coche
const iconoCoche = L.icon({
    iconUrl : '/images/coche.svg',
    iconSize : [40, 40],
    iconAnchor : [20, 40],
    popupAnchor : [0, -40]
})

// ------------------ Lógica de geolocalización ------------------ //

const btnAparcar = document.querySelector('#btn-aparcar');
const mapOverLay = document.querySelector('#map-overlay');
let marcadorCoche = null; // variable para almacenar el marcador del coche
let aparcado = false; // variable para controlar si el coche ya está aparcado

// recuperamos la ubicación del coche aparcado al cargar la página, si existe
const parkingGuardadoEnCurso = localStorage.getItem('aparcamientoEnCurso');
if (parkingGuardadoEnCurso) {

    const parkingEnCursoRecuperado = JSON.parse(parkingGuardadoEnCurso);

    // actualizamos la vista del mapa a la ubicación guardada
    miMapa.setView([parkingEnCursoRecuperado.latitud, parkingEnCursoRecuperado.longitud], 18);

    // creamos el marcador del coche en la ubicación guardada
    marcadorCoche = L.marker([parkingEnCursoRecuperado.latitud, parkingEnCursoRecuperado.longitud], {icon: iconoCoche}).addTo(miMapa);
    marcadorCoche.bindPopup("Vehículo aparcado").openPopup(); // añadimos un popup al marcador del coche

    mapOverLay.classList.add('hidden'); // ocultamos el overlay borroso para mostrar el mapa claramente

    // Cambiamos el diseño del botón para indicar que el coche está aparcado
    btnAparcar.disabled = false;
    btnAparcar.textContent = "Finalizar Aparcamiento";
    btnAparcar.className = "w-full bg-emerald-400 text-white py-4 rounded-2xl shadow-xl font-bold text-lg flex items-center justify-center gap-2 active:bg-emerald-500 transition-colors";

    aparcado = true; // actualizamos el estado del coche a aparcado

}

// Pinta el marcarcador del coche donde aparco y guarda la posicion en localStorage
btnAparcar.addEventListener('click', () => {

    if (aparcado) {

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
                // eliminamos el marcador del coche del mapa
                if (marcadorCoche) {
                    miMapa.removeLayer(marcadorCoche);
                    marcadorCoche = null;
                }

                miMapa.setView([36.72016, -4.42034], 14); // volvemos a la vista genérica del mapa

                // mostramos el overlay borroso
                mapOverLay.classList.remove('hidden');

                // restauramos el estado del botón
                btnAparcar.textContent = "Aparcar Aquí";
                btnAparcar.className = "w-full bg-brand-primary text-white py-4 rounded-2xl shadow-xl font-bold text-lg flex items-center justify-center gap-2 active:bg-brand-secondary transition-colors disabled:opacity-70 disabled:cursor-not-allowed";

                aparcado = false; // actualizamos el estado del coche a no aparcado
            }
        })

        return; // salimos de la función para evitar ejecutar el código de geolocalización
    }

    btnAparcar.disabled = true; // deshabilitamos el botón para evitar múltiples clics
    btnAparcar.textContent = "Localizando..."; // cambiamos el texto del botón para indicar que se está localizando

    // geolocalizacion del usuario en tiempo real
    if ("geolocation" in navigator) { // verificamos si el navegador siporta geolocalización

        // obtenemos la posición del usuario
        navigator.geolocation.getCurrentPosition(

            // si se obtiene la posición correctamente, esta función se ejecuta
            function(posicion) {

                // extraemos las coordenadas reales proporcionadas por el navegador
                const latitud = posicion.coords.latitude;
                const longitud = posicion.coords.longitude;

                // actualizamos la vista del mapa a la ubicación del usuario
                miMapa.setView([latitud, longitud], 18);

                // comprobamos si ya existe un marcador del coche, si es así, lo actualizamos, si no, lo creamos
                if (marcadorCoche) {
                    marcadorCoche.setLatLng([latitud, longitud]);
                } else {
                    marcadorCoche = L.marker([latitud, longitud], {icon: iconoCoche}).addTo(miMapa);
                }

                marcadorCoche.bindPopup("Vehículo aparcado").openPopup(); // añadimos un popup al marcador del coche

                // ocultamos el overlay borroso para mostrar el mapa claramente
                mapOverLay.classList.add('hidden');

                // Cambiamos el diseño del botón para indicar que el coche está aparcado
                btnAparcar.disabled = false;
                btnAparcar.textContent = "Finalizar Aparcamiento";
                btnAparcar.className = "w-full bg-emerald-400 text-white py-4 rounded-2xl shadow-xl font-bold text-lg flex items-center justify-center gap-2 active:bg-emerald-500 transition-colors";

                aparcado = true; // actualizamos el estado del coche a aparcado

                // creamos el paquete de datos con la ubicacion para guardarlo en localStorage
                const datosAparcamiento = {
                    latitud: latitud,
                    longitud: longitud,
                    timestamp : Date.now()
                };

                localStorage.setItem('aparcamientoEnCurso', JSON.stringify(datosAparcamiento)); // guardamos los datos en localStorage para poder recuperarlos después

            },

            // si el usuario no acepta o no habilita la geolocalización, esta función se ejecuta
            function(error) {
                console.error("Error al obtener la geolocalización: ", error);
                
                // Usamos SweetAlert en lugar de alert()
                Swal.fire({
                    icon: 'error',
                    title: '¡Ubicacion no disponible!',
                    text: 'No se pudo obtener tu ubicación. Asegúrate de tener el GPS activado.',
                    confirmButtonColor: '#627FD9'
                });

                btnAparcar.disabled = false;
                btnAparcar.textContent = "Intentar de nuevo";
            },

            {
                enableHighAccuracy: true, // intentamos obtener la ubicación más precisa posible
                timeout: 5000, // tiempo máximo para obtener la ubicación
            }

        );

    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Navegador no compatible',
            text: 'Tu navegador no soporta geolocalización.',
            confirmButtonColor: '#627FD9'
        });
        btnAparcar.disabled = false;
        btnAparcar.textContent = "Aparcar Aquí";
    }

});