const db = require('../database/db');

class AparcamientoModel {

    // Guarda solo las cordenadas y la hora de inicio, el resto se actualiza al finalizar el aparcamiento
    static crearAparcamiento(usuarioId, latitud, longitud, tiempoInicio) {

        const sql = `
            INSERT INTO aparcamientos (usuario_id, latitud, longitud, inicio) 
            VALUES (?, ?, ?, ?)
        `;

        const info = db.prepare(sql).run(usuarioId, latitud, longitud, tiempoInicio);
        return info.lastInsertRowid; // Devolvemos el ID del aparcamiento recién creado

    }

    // finalizar aparcamiento actualiza la entrada con los datos que faltan
    static finalizarAparcamiento(aparcamientoId, tiempoFin, minutosTotales) {

        const sql = `
            UPDATE aparcamientos 
            SET fin = ?, tiempoTotalMinutos = ? 
            WHERE id = ?
        `;

        return db.prepare(sql).run(tiempoFin, minutosTotales, aparcamientoId);

    }

    // miramos si el hay un parking es decir si fin es null.
    static obtenerActivoPorUsuario(usuarioId) {
        
        const sql = 'SELECT * FROM aparcamientos WHERE usuario_id = ? AND fin IS NULL'; // si esxiste un registro con fin null significa que el parking esta activo
        return db.prepare(sql).get(usuarioId);

    }

    // obtenemos el historial del usuario ordenados por el mas reciente para mostrarlo en l interfaz
    static obtenerHistorialPorUsuario(usuarioId) {
        
        const sql = 'SELECT * FROM aparcamientos WHERE usuario_id = ? AND fin IS NOT NULL ORDER BY inicio DESC';
        return db.prepare(sql).all(usuarioId);
        
    }

    //Eliminar un registro del historial
    static eliminar(id, usuarioId) {
        
        const sql = 'DELETE FROM aparcamientos WHERE id = ? AND usuario_id = ?';
        const info = db.prepare(sql).run(id, usuarioId);
        
        return info.changes > 0; // Devuelve true si realmente se borró alguna fila
    }

}

module.exports = AparcamientoModel;