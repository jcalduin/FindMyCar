const db = require('../database/db');

class UsuarioModel {
    
    // buscar usuario por nickname (para login)
    static buscarPorNickname(nickname) {

        const sql = 'SELECT * FROM usuarios WHERE nickname = ?';
        return db.prepare(sql).get(nickname);

    }

    // buscar usuario por email (recuperación de contraseña)
    static buscarPorEmail(email) {

        const sql = 'SELECT * FROM usuarios WHERE email = ?';
        return db.prepare(sql).get(email);

    }

    // Método para crear un nuevo usuario en la base de datos
    static crear(nickname, email, passwordHash) {

        const sql = 'INSERT INTO usuarios (nickname, email, password) VALUES (?, ?, ?)';
        
        const info = db.prepare(sql).run(nickname, email, passwordHash);
        
        return info.lastInsertRowid; 
    }
}

module.exports = UsuarioModel;