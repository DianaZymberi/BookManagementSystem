require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "BookManagementSystem",
    port: 3306,
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
