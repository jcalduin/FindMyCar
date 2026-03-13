module.exports = (db) => {

    const sql = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nickname TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `;

    // Ejecutamos la creación de la tabla
    db.exec(sql);

    // Comprobamos si la tabla está completamente vacía
    const count = db.prepare('SELECT count(*) as total FROM usuarios').get();
    
    if (count.total === 0) {
        
        db.prepare('INSERT INTO usuarios (nickname, email, password) VALUES (?, ?, ?)').run(
            'javi',
            'javi@.email.com',
            '$2b$10$z8DWvghMRt0sR5wpGY5pLuZzG9dQKR8ZzLQ1XPKfiLo0g8HBd.kS.'
        );
    
    } 

};