// File: config/db.js
require('dotenv').config(); // Panggil kunci brankas
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log(`✅ Terhubung ke Database MySQL di host: ${process.env.DB_HOST}`);
});

module.exports = db;