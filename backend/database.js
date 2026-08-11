require("dotenv").config();

const mysql = require("mysql2");

const connection = mysql.createConnection({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    port: process.env.DB_PORT || 3306,

    dateStrings: true,

    ssl: process.env.DB_SSL === "true"
        ? {
            rejectUnauthorized: false
        }
        : undefined

});

connection.connect((err) => {

    if (err) {

        console.log(
            "❌ Erreur connexion MySQL :",
            err.message
        );

        return;

    }

    console.log("✅ MySQL connecté !");

});

module.exports = connection;