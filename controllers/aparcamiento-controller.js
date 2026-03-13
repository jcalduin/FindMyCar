const AparcamientoModel = require('../models/aparcamiento-model');

const aparcamientoController = {

    // Registra nuevo aparcamiento
    aparcar: (req, res) => {

        try {

            // comprobamos que el usuario tien sesion iniciada
            if (!req.session.user) {
                return res.status(401).json({ error: 'No tienes sesión iniciada.' });
            }

            const { latitud, longitud, inicio } = req.body;
            const usuarioId = req.session.user.id;

            if (!latitud || !longitud || !inicio) {
                return res.status(400).json({ error: 'Faltan datos de ubicación.' });
            }

            // guardamos el nuevo aparcamiento y obtenemos su ID para devolverlo al cliente
            const nuevoId = AparcamientoModel.crearAparcamiento(usuarioId, latitud, longitud, inicio);
            
            res.json({ success: true, id: nuevoId, message: 'Ubicación guardada en tu cuenta.' });

        } catch (error) {

            console.error('Error al aparcar:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });

        }

    },

    // finalizar el parcamiento y actualizar el historial
    finalizar: (req, res) => {

        try {

            if (!req.session.user) return res.status(401).json({ error: 'No autorizado.' });

            const { id, fin, minutosTotales } = req.body;

            if (!id || !fin || minutosTotales === undefined) {
                return res.status(400).json({ error: 'Faltan datos para finalizar.' });
            }

            AparcamientoModel.finalizarAparcamiento(id, fin, minutosTotales);
            res.json({ success: true, message: 'Aparcamiento finalizado y guardado en historial.' });

        } catch (error) {

            console.error('Error al finalizar aparcamiento:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });

        }

    },

    // cogemos el historial para mostrar la interfaz
    historial: (req, res) => {

        try {

            if (!req.session.user) return res.status(401).json({ error: 'No autorizado.' });

            const historial = AparcamientoModel.obtenerHistorialPorUsuario(req.session.user.id);
            res.json({ success: true, historial });

        } catch (error) {

            console.error('Error al obtener historial:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });

        }
    },

    // Comprobamos sie l usuario tiene el aparcamiento activo
    activo: (req, res) => {

        try {

            if (!req.session.user) return res.status(401).json({ error: 'No autorizado.' });

            const activo = AparcamientoModel.obtenerActivoPorUsuario(req.session.user.id);
            
            // Si devuelve undefined, es que no tiene coche aparcado. Lo manejamos devolviendo null.
            res.json({ success: true, activo: activo || null });

        } catch (error) {

            console.error('Error al obtener aparcamiento activo:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });

        }
        
    },

    // Eliminar un aparcamiento
    eliminar: (req, res) => {

        try {

            if (!req.session.user) return res.status(401).json({ error: 'No autorizado.' });

            // Cogemos el ID que nos llegará por la URL y lo pasamos al modelo para eliminarlo
            const idAparcamiento = req.params.id; 

            const borrado = AparcamientoModel.eliminar(idAparcamiento, req.session.user.id);

            if (borrado) {

                res.json({ success: true, message: 'Aparcamiento eliminado correctamente.' });

            } else {

                res.status(404).json({ error: 'Registro no encontrado o no tienes permiso.' });

            }

        } catch (error) {

            console.error('Error al eliminar aparcamiento:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });
            
        }
    }

};

module.exports = aparcamientoController;