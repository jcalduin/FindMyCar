const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth-controller');

//procesar el formulario de Registro
router.post('/registro', authController.registro);

//procesar el formulario de Login
router.post('/login', authController.login);

//cerrar sesión
router.post('/logout', authController.logout);

module.exports = router;