const express = require('express');
const router = express.Router();

const aparcamientoController = require('../controllers/aparcamiento-controller');

// Guardar las coordenadas al aparcar
router.post('/aparcar', aparcamientoController.aparcar);

// Finalizar el aparcamiento en curso
router.post('/finalizar', aparcamientoController.finalizar);

// Comprobar si hay un coche aparcado actualmente (al recargar la app)
router.get('/activo', aparcamientoController.activo);

// Obtener todo el historial de aparcamientos
router.get('/historial', aparcamientoController.historial);

// Eliminar un aparcamiento del historial por su ID
router.delete('/:id', aparcamientoController.eliminar);

module.exports = router;