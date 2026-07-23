const express = require("express");

const router = express.Router();

const db = require("../database");


// INSCRIPTION

router.post("/register", (req, res) => {

    const { nom, prenom, age, email, motDePasse } = req.body;


    const sql = `
        INSERT INTO utilisateurs 
        (nom, prenom, age, email, motDePasse)
        VALUES (?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [nom, prenom, age, email, motDePasse],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Erreur création utilisateur"
                });

            }


            res.json({

                message: "Utilisateur créé avec succès",

                id: result.insertId

            });


        }
    );


});



// CONNEXION

router.post("/login", (req, res) => {

    const { email, motDePasse } = req.body;


    const sql = `
        SELECT * FROM utilisateurs
        WHERE email = ? AND motDePasse = ?
    `;


    db.query(
        sql,
        [email, motDePasse],
        (err, result) => {


            if(err){

                return res.status(500).json({
                    message:"Erreur serveur"
                });

            }


            if(result.length === 0){

                return res.status(401).json({
                    message:"Email ou mot de passe incorrect"
                });

            }


            res.json({

                message:"Connexion réussie",

                utilisateur: result[0]

            });


        }
    );


});


module.exports = router;