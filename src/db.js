require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wsc_mobile_app',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true // return DATETIME columns as plain strings, e.g. "2024-08-24 00:05:00"
});

module.exports = pool;
