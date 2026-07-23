const express = require("express");
const cors = require("cors");

const db = require("./database");

const usersRoutes = require("./routes/users");


const app = express();

const PORT = 3000;


app.use(cors());

app.use(express.json());


// Route utilisateurs
app.use("/users", usersRoutes);



app.get("/", (req, res) => {

    res.send("🚀 Backend TodoApp Pro fonctionne !");

});



app.get("/test-db", (req, res) => {

    db.query("SELECT 1", (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).send("Erreur MySQL");

        }


        res.send("✅ Connexion MySQL réussie !");

    });

});



app.listen(PORT, () => {

    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);

});