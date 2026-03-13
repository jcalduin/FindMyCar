// script que procesa las peticiones api de la interfaz de aparcamiento, comunicándose con el backend a través de fetch
// servicio que gestiona las peticiones en la nube utilizando fetch para comunicarse con el backend

const AparcamientoService = {
    
    // iniciar aparcamiento
    aparcar: async (latitud, longitud, inicio) => {

        const respuesta = await fetch('/api/aparcamientos/aparcar', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ latitud, longitud, inicio })
        });

        return await respuesta.json();
    },

    // Finalizar aparcamiento
    finalizar: async (id, fin, minutosTotales) => {

        const respuesta = await fetch('/api/aparcamientos/finalizar', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ id, fin, minutosTotales })
        });

        return await respuesta.json();
    },

    // Consultar aparcamiento activo 
    obtenerActivo: async () => {

        const respuesta = await fetch('/api/aparcamientos/activo');
        return await respuesta.json();

    },

    // Obtener historial de aparcamientos
    obtenerHistorial: async () => {

        const respuesta = await fetch('/api/aparcamientos/historial');
        return await respuesta.json();

    },

    //Eliminar del historial 
    eliminar: async (id) => {

        const respuesta = await fetch(`/api/aparcamientos/${id}`, {
            method: 'DELETE'
        });
        
        return await respuesta.json();
    }

};