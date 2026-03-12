// ===================================
// ELEMENTOS DEL DOM (Menú Offcanvas) 
// ===================================
const btnAbrirMenu = document.querySelector('#btn-abrir-menu');
const btnCerrarMenu = document.querySelector('#btn-cerrar-menu');
const menuLateral = document.querySelector('#menu-lateral');
const menuBackdrop = document.querySelector('#menu-backdrop');

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

// =====================
// Manejador de eventos
// =====================

// click menu haburguesa
btnAbrirMenu.addEventListener('click', abrirMenu);

// click boton cerrar menu
btnCerrarMenu.addEventListener('click', cerrarMenu);

// click fuera del menu (en el backdrop)
menuBackdrop.addEventListener('click', cerrarMenu);