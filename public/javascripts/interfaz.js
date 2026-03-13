// ===================================
// ELEMENTOS DEL DOM (Menú Offcanvas) 
// ===================================
const btnAbrirMenu = document.querySelector('#btn-abrir-menu');
const btnCerrarMenu = document.querySelector('#btn-cerrar-menu');
const menuLateral = document.querySelector('#menu-lateral');
const menuBackdrop = document.querySelector('#menu-backdrop');

// ==========================================
// ELEMENTOS DEL DOM (Modal Historial)
// ==========================================
const btnAbrirHistorial = document.querySelector('#btn-historial'); // El botón que esta del menú lateral
const modalHistorial = document.querySelector('#modal-historial');
const modalHistorialBackdrop = document.querySelector('#modal-historial-backdrop');
const btnCerrarModal = document.querySelector('#btn-cerrar-modal');
const listaHistorial = document.querySelector('#lista-historial');
const templateTarjeta = document.querySelector('#template-tarjeta-aparcamiento');

// ==========================================
// ELEMENTOS DEL DOM (Modal Login/Registro)
// ==========================================
const btnAbrirLogin = document.querySelector('#btn-login'); //menu lateral
const modalLogin = document.querySelector('#modal-login');
const modalLoginBackdrop = document.querySelector('#modal-login-backdrop');
const btnCerrarLogin = document.querySelector('#btn-cerrar-login');

// Elementos internos del Modal (Tabs y Formularios)
const tabLogin = document.querySelector('#tab-login');
const tabRegistro = document.querySelector('#tab-registro');
const formLogin = document.querySelector('#form-login');
const formRegistro = document.querySelector('#form-registro');
const tituloModalLogin = document.querySelector('#titulo-modal-login');
const alertaAuth = document.querySelector('#alerta-auth');
const textoAlertaAuth = document.querySelector('#texto-alerta-auth');

// ===================
// FUNCIONES DEL MENÚ  
// ===================

// Funcion para abrir el menu deslizandolo desde la derecha
function abrirMenu() {

    // panel del menu
    menuLateral.classList.remove('translate-x-full');
    menuLateral.classList.add('translate-x-0');

    // backdrop del menu
    menuBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    menuBackdrop.classList.add('opacity-100');
}

// Funcion para cerrar el menu deslizandolo hacia la derecha
function cerrarMenu() {

    // panel del menu
    menuLateral.classList.remove('translate-x-0');
    menuLateral.classList.add('translate-x-full');

    // backdrop del menu
    menuBackdrop.classList.remove('opacity-100');
    menuBackdrop.classList.add('opacity-0', 'pointer-events-none');
}

// =================================
// FUNCIONES DEL MODAL DE HISTORIAL 
// =================================

// Funcion para abrir el modal del historial de aparcamientos
function abrirModalHistorial() {

    pintarHistorial(); 
    
    cerrarMenu();

    // backdrop del modal
    modalHistorialBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    modalHistorialBackdrop.classList.add('opacity-100');

    // tarjeta del modal
    modalHistorial.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
    modalHistorial.classList.add('opacity-100', 'scale-100');
}

// Funcion para cerrar el modal del historial de aparcamientos
function cerrarModalHistorial() {

    // ocultar backdrop del modal
    modalHistorialBackdrop.classList.remove('opacity-100');
    modalHistorialBackdrop.classList.add('opacity-0', 'pointer-events-none');

    // cerrar tarjeta del modal
    modalHistorial.classList.remove('opacity-100', 'scale-100');
    modalHistorial.classList.add('opacity-0', 'pointer-events-none', 'scale-95');

}

// ==========================================
// FUNCIONES DEL MODAL DE LOGIN / REGISTRO
// ==========================================

// abrir modal de login/registro
function abrirModalLogin() {

    cerrarMenu(); 
    
    mostrarTabLogin(); // mostrar login por defecto

    // backdrop del modal
    modalLoginBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    modalLoginBackdrop.classList.add('opacity-100');

    // tarjeta del modal
    modalLogin.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
    modalLogin.classList.add('opacity-100', 'scale-100');
}

// cerrar modal de login/registro
function cerrarModalLogin() {

    modalLoginBackdrop.classList.remove('opacity-100');
    modalLoginBackdrop.classList.add('opacity-0', 'pointer-events-none');

    modalLogin.classList.remove('opacity-100', 'scale-100');
    modalLogin.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
}

// limpiar alertas de errores del modal registro/login
function limpiarAlertasErroresAuth() {

    alertaAuth.classList.add('hidden');

    document.querySelectorAll('.input-auth').forEach(input => {
        input.classList.remove('border-red-500', 'bg-red-50');
    });

}

// cambiar pestaña registro -> login
function mostrarTabLogin() {
    
    formLogin.classList.remove('hidden');
    formRegistro.classList.add('hidden');
    
    tituloModalLogin.textContent = 'Bienvenido';

    limpiarAlertasErroresAuth(); // limpiamos cualquier alerta de error que pudiera haber

    //pestaña login
    tabLogin.classList.add('bg-white', 'text-brand-primary', 'shadow-sm', 'font-bold');
    tabLogin.classList.remove('text-gray-500', 'hover:text-gray-700', 'font-medium');

    // pestaña registro
    tabRegistro.classList.remove('bg-white', 'text-brand-primary', 'shadow-sm', 'font-bold');
    tabRegistro.classList.add('text-gray-500', 'hover:text-gray-700', 'font-medium');
}

// cambiar pestaña login -> registro
function mostrarTabRegistro() {
    
    formRegistro.classList.remove('hidden');
    formLogin.classList.add('hidden');
    
    tituloModalLogin.textContent = 'Crear Cuenta';

    limpiarAlertasErroresAuth(); // limpiamos cualquier alerta de error que pudiera haber

    // pestaña registro
    tabRegistro.classList.add('bg-white', 'text-brand-primary', 'shadow-sm', 'font-bold');
    tabRegistro.classList.remove('text-gray-500', 'hover:text-gray-700', 'font-medium');

    // pestaña login
    tabLogin.classList.remove('bg-white', 'text-brand-primary', 'shadow-sm', 'font-bold');
    tabLogin.classList.add('text-gray-500', 'hover:text-gray-700', 'font-medium');
}

// ===========
// UTILIDADES
// ===========

// Funcion para formatear la fecha y hora de aparcamiento
function convertirFecha(timestamp) {

    const fecha = new Date(timestamp);
    const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    return fecha.toLocaleDateString('es-ES', opciones) + 'h';

}

// funcion generica para mostrar alertas.
function mostrarAlerta(titulo, texto, icono = 'info', esConfirmacion = false, txtConfirmar = 'Aceptar') {

    const colorBoton = (icono === 'warning') ? '#ef4444' : '#798BF2'; 

    return Swal.fire({
        title: titulo,
        text: texto,
        icon: icono,
        showCancelButton: esConfirmacion, // Solo muestra "Cancelar" si esConfirmacion es true
        confirmButtonColor: colorBoton,
        cancelButtonColor: '#9ca3af',
        confirmButtonText: txtConfirmar,
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'rounded-3xl w-11/12 max-w-sm border border-gray-100 shadow-2xl',
            title: 'text-brand-primary font-bold text-xl',
            confirmButton: 'rounded-xl font-bold px-6',
            cancelButton: 'rounded-xl font-medium px-6'
        }
    });
}

// ================
// LÓGICA DE DATOS 
// ================

// pintar historial
function pintarHistorial() {
    
    listaHistorial.innerHTML = '';

    // cogemos datros del locaslstorge
    const historialGuardado = localStorage.getItem('historialAparcamientos');
    let historial = [];

    if (historialGuardado) historial = JSON.parse(historialGuardado);

    // no existe aún historial en localstorage o el historial esta vacio
    if (historial.length === 0) {
        listaHistorial.innerHTML = '<p class="text-center text-gray-500 py-8 text-sm">Aún no tienes aparcamientos guardados.</p>';
        return; // Detenemos la función aquí
    }

    // recorremos historial y pintamos las tarjetas
    historial.forEach(registro => {
        
        const tarjetaClonada = templateTarjeta.content.cloneNode(true);

        tarjetaClonada.querySelector('.txt-fecha').textContent = convertirFecha(registro.inicio);
        tarjetaClonada.querySelector('.txt-duracion').textContent = `Aparcado durante ${registro.tiempoTotalMinutos} min`;

        const btnBorrar = tarjetaClonada.querySelector('.btn-borrar-historial'); 
        btnBorrar.dataset.id = registro.id; // preparamos el id para el borrado

        listaHistorial.appendChild(tarjetaClonada);
    });
}

// Elimina un aparcamiento del localstorage y refresca la vista
function eliminarAparcamiento(id) {

    const historialGuardado = localStorage.getItem('historialAparcamientos');
    if (!historialGuardado) return;

    let historial = JSON.parse(historialGuardado);
    historial = historial.filter(registro => registro.id !== Number(id)); //nos devuelve un nuevo array sin el registro que queremos eliminar

    //volvemos a guardar esa nueva lista en localsttorage
    localStorage.setItem('historialAparcamientos', JSON.stringify(historial));

    pintarHistorial(); 

}

// =====================
// Manejador de eventos
// =====================

// ========= menú lateral y modal historial ======== (siempre existen en el DOM)

// click menu haburguesa
btnAbrirMenu.addEventListener('click', abrirMenu);

// click boton cerrar menu "X"
btnCerrarMenu.addEventListener('click', cerrarMenu);

// click fuera del menu (en el backdrop)
menuBackdrop.addEventListener('click', cerrarMenu);

// click boton mostrar historial
btnAbrirHistorial.addEventListener('click', abrirModalHistorial);

// click boton cerrar modal historial "X"
btnCerrarModal.addEventListener('click', cerrarModalHistorial);

// click fuera del modal (en el backdrop)
modalHistorialBackdrop.addEventListener('click', cerrarModalHistorial);

// click en la papelera para eliminar el registro
listaHistorial.addEventListener('click', async (e) => {

    const btnBorrar = e.target.closest('.btn-borrar-historial');

    if (btnBorrar) {

        const idAparcamiento = btnBorrar.dataset.id;

        const respuesta = await mostrarAlerta(
            '¿Eliminar aparcamiento?',
            'Esta ubicacion se borrar para siempre',
            true,
            'eliminar'
        );

        if (respuesta.isConfirmed) eliminarAparcamiento(idAparcamiento);
    }

});

// ========= modales y formularios de auth ======== (se añade ?. porque puede no renderizar si el usuario esta login)

// click boton mostrar login/registro
btnAbrirLogin?.addEventListener('click', abrirModalLogin);

// click cerrar modal login/registro "X"
btnCerrarLogin?.addEventListener('click', cerrarModalLogin);

// click fuera del modal de login/registro (en el backdrop)
modalLoginBackdrop?.addEventListener('click', cerrarModalLogin);

// tab pestaña login
tabLogin?.addEventListener('click', mostrarTabLogin);

// tab pestaña registro
tabRegistro?.addEventListener('click', mostrarTabRegistro);

// submit formulario login
formLogin?.addEventListener('submit', async (e) => {

    e.preventDefault(); // prevenimos el comportamiento por defecto del formulario
    limpiarErroresAuth();

    // recogemos datos del formulario
    const nickname = document.querySelector('#login-username').value.trim();
    const password = document.querySelector('#login-password').value;

    try {

        const data = await AuthService.login(nickname, password);

        if (data.error) {

            alertaAuth.classList.remove('hidden');
            textoAlertaAuth.textContent = data.error;

            document.querySelector('#login-username').classList.add('border-red-500', 'bg-red-50');
            document.querySelector('#login-password').classList.add('border-red-500', 'bg-red-50');

        } else if (data.success) {

            cerrarModalLogin();

            mostrarAlerta(
                '¡Éxito!', 
                data.message, 
                'success'
            );

            setTimeout(() => window.location.reload(), 1500);
            
        }

    } catch (error) {

        console.error("Error en petición de login:", error);

    }
});

// submit formulario registro
formRegistro?.addEventListener('submit', async (e) => {

    e.preventDefault();
    limpiarErroresAuth();

    const email = document.querySelector('#reg-email').value.trim();
    const nickname = document.querySelector('#reg-username').value.trim();
    const password = document.querySelector('#reg-password').value;
    const passwordConfirm = document.querySelector('#reg-password-confirm').value;

    try {

        const data = await AuthService.registro({ email, nickname, password, passwordConfirm });

        if (data.error) {

            alertaAuth.classList.remove('hidden');
            textoAlertaAuth.textContent = data.error;
            
            formRegistro.querySelectorAll('.input-auth').forEach(i => i.classList.add('border-red-500', 'bg-red-50'));

        } else if (data.success) {

            cerrarModalLogin();

            mostrarAlerta(
                '¡Cuenta Creada!', 
                data.message, 
                'success'
            );

            setTimeout(() => window.location.reload(), 1500);

        }

    } catch (error) {

        console.error("Error en petición de registro:", error);
        
    }
});
