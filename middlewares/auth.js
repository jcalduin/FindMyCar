const auth = (req, res, next) => {
    // Si el usuario ha iniciado sesión
    if (req.session.user) {
        res.locals.isLoggedIn = true;
        res.locals.user = req.session.user; // Podría contener el id, nickname, email, etc.
    } else {
        // Si es un invitado
        res.locals.isLoggedIn = false;
        res.locals.user = null;
    }

    next(); // Pasa el control al siguiente middleware o ruta
}

module.exports = auth;