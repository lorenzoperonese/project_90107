const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create mysql2 pool
const pool = mysql.createPool(dbConfig);

// Test connection to the database
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connessione al database MySQL stabilita con successo!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Errore di connessione al database:', error);
    return false;
  }
};

module.exports = { pool, testConnection };
