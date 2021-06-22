const mysql = require('mysql2/promise');

const config = {
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
    }
}

const query = async (sql, params=[]) => {
    const connection = await mysql.createConnection(config.db);
    const [results, ] = await connection.execute(sql, params);
    return results;
}

module.exports = {
    query
} 



