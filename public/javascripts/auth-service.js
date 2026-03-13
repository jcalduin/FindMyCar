//script que procesa las peticiones api de la interfaz de login y registro, comunicándose con el backend a través de fetch

const AuthService = {
    
    // Método para iniciar sesión
    login: async (nickname, password) => {

        const respuesta = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ nickname, password })
        });

        return await respuesta.json(); // Devuelve { success: true... } o { error: '...' }
    },

    // Método para registrarse
    registro: async (datosUsuario) => {

        const respuesta = await fetch('/api/auth/registro', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(datosUsuario)
        });

        return await respuesta.json();
    },

    // Método para cerrar sesión
    logout: async () => {

        const respuesta = await fetch('/api/auth/logout', { 
            method: 'POST' 
        });
        
        return await respuesta.json();
    }
};