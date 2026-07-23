const mysql = require("mysql2");


const connection = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "MySql@12345",

    database: "todolist"

});


connection.connect((err) => {

    if (err) {

        console.log("❌ Erreur connexion MySQL :", err.message);
        return;

    }

    console.log("✅ MySQL connecté !");

});


module.exports = connection;