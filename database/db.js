const Database = require('better-sqlite3');
const path = require('path');

// ruta absoluta al archivo que creamos
const dbPath = path.join(__dirname, 'findmycar.sqlite');

// instanciar la base de datos, usando patron singleton para evitar múltiples conexiones
const db = new Database(dbPath, { 
    fileMustExist: false //Si es la primera vez, se creará el archivo automáticamente
});

/**
 * WAL (write-ahead Logging) es un modo que ayuda maejorar el rendimiento de la BD.
 * En lugar de escribir directamente en el archivo de la BD, se escribe un archivo registro WAL
 * que luego se sincroniza. Permitiendo multiples usuarios leyendo y escribiendo al mismo tiempo sin bloqueos.
 * Además, habilitamos las claves foráneas para asegurar la integridad referencial entre tablas.
 * Esto es especialmente importante para mantener la consistencia de los datos en nuestra aplicación.
*/
db.pragma('journal_mode = WAL'); 
db.pragma('foreign_keys = ON');

//debug
console.log('🔌 Conexión a SQLite establecida correctamente (Modo WAL activado).');

// Importamos y ejecutamos las inicializaciones
require('./initUsuarios')(db);
require('./initAparcamientos')(db);

module.exports = db;