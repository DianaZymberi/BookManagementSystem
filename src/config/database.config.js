require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 50,
    maxIdle: 25,
    idleTimeout: 30000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    charset: "utf8mb4"
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to the database successfully!");
        connection.release();
    } catch (error) {
        console.log("There was an error connecting to the database:", error);
        throw error;
    }
}

testConnection();
module.exports = pool;
