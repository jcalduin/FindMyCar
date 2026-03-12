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
    
    cerrarMenu();

    // backdrop del modal
    modalHistorialBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    modalHistorialBackdrop.classList.add('opacity-100');

    // tarjeta del modal
    modalHistorial.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
    modalHistorial.classList.add('opacity-100', 'scale-100');
}

function cerrarModalHistorial() {

    // ocultar backdrop del modal
    modalHistorialBackdrop.classList.remove('opacity-100');
    modalHistorialBackdrop.classList.add('opacity-0', 'pointer-events-none');

    // cerrar tarjeta del modal
    modalHistorial.classList.remove('opacity-100', 'scale-100');
    modalHistorial.classList.add('opacity-0', 'pointer-events-none', 'scale-95');

}

// =====================
// Manejador de eventos
// =====================

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