const bcrypt = require('bcrypt');
const UsuarioModel = require('../models/usuario.model');

const authController = {

    registro: (req, res) => {

        try {
            // Extraemos los datos
            const { email, nickname, password, passwordConfirm } = req.body;

            // Validamos que no haya campos vacios
            if (!email || !nickname || !password || !passwordConfirm) {
                return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
            }

            // Validación de que contraseñas coincidan
            if (password !== passwordConfirm) {
                return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
            }

            // Validación comprobar si el nickname ya existe
            const existeNickname = UsuarioModel.buscarPorNickname(nickname);
            if (existeNickname) {
                return res.status(400).json({ error: 'Ese nombre de usuario ya está en uso.' });
            }

            // Validación comprobar si el email ya existe
            const existeEmail = UsuarioModel.buscarPorEmail(email);
            if (existeEmail) {
                return res.status(400).json({ error: 'Ese correo electrónico ya está registrado.' });
            }

            // hash de la contraseña 
            const hashPassword = bcrypt.hashSync(password, 10);

            // guardamos en la bd y obtenemos el ID del nuevo usuario
            const nuevoUsuarioId = UsuarioModel.crear(nickname, email, hashPassword);

            // Creamos la sesión para el nuevo usuario, solo datos mínimos para no almacenar información sensible
            req.session.user = {
                id: nuevoUsuarioId,
                nickname: nickname
            };

            res.json({ success: true, message: 'Cuenta creada con éxito.' }); //cuenta creada con exito

        } catch (error) {

            console.error('Error en registro:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });

        }

    },

    login: (req, res) => {

        try {

            const { nickname, password } = req.body;

            if (!nickname || !password) {
                return res.status(400).json({ error: 'Usuario y contraseña obligatorios.' });
            }

            // Buscamos al usuario en la BD
            const usuario = UsuarioModel.buscarPorNickname(nickname);

            // Si el usuario no existe O la contraseña no coincide con el hash almacenado, devolvemos error
            if (!usuario || !bcrypt.compareSync(password, usuario.password)) {
                return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
            }

            // creamos la sesion
            req.session.user = {
                id: usuario.id,
                nickname: usuario.nickname
            };

            res.json({ success: true, message: `¡Bienvenido de nuevo, ${usuario.nickname}!` }); // login exitoso

        } catch (error) {

            console.error('Error en login:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });

        }
    },

    logout: (req, res) => {
        
        req.session.destroy((err) => {

            if (err) {
                return res.status(500).json({ error: 'No se pudo cerrar la sesión.' });
            }

            // Borramos la cookie del navegador
            res.clearCookie('connect.sid'); 
            
            res.json({ success: true, message: 'Sesión cerrada correctamente.' });

        });
    }
};

module.exports = authController;