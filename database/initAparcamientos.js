module.exports = (db) => {

    const sql = `
        CREATE TABLE IF NOT EXISTS aparcamientos (
            id INTEGER PRIMARY KEY,
            usuario_id INTEGER NOT NULL,
            latitud REAL NOT NULL,
            longitud REAL NOT NULL,
            inicio INTEGER NOT NULL,
            fin INTEGER,
            tiempoTotalMinutos INTEGER,
            FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
        );
    `;

    db.exec(sql);

    // Comprobamos si la tabla está vacía
    const count = db.prepare('SELECT count(*) as total FROM aparcamientos').get();

    if (count.total === 0) {
        // Buscamos el ID del usuario que acabamos de crear en el otro archivo
        const usuario = db.prepare('SELECT id FROM usuarios WHERE nickname = ?').get('javi');
        
        if (usuario) {
            // Generamos fechas para simular un aparcamiento de 1 hora
            const ahora = Date.now();
            const haceUnaHora = ahora - (60 * 60 * 1000);
            
            db.prepare(`
                INSERT INTO aparcamientos (id, usuario_id, latitud, longitud, inicio, fin, tiempoTotalMinutos) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(
                ahora,              // Usamos el timestamp actual como ID primario
                usuario.id,         // El ID de "javi"
                36.72016,           // Latitud (Málaga)
                -4.42034,           // Longitud (Málaga)
                haceUnaHora,        // Momento de aparcar
                ahora,              // Momento de recoger el coche
                60                  // Minutos totales
            );
            
        }
    }

};