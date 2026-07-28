const express = require("express");

const router = express.Router();

const db = require("../database");

const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {

    console.log(req.body);

    const { nom, prenom, email, motDePasse } = req.body;

    const motDePasseHash = await bcrypt.hash(motDePasse, 10);

    const sql = `
        INSERT INTO utilisateurs 
        (nom, prenom, email, motDePasse)
        VALUES (?, ?, ?, ?)
    `;


    db.query(
        sql,
        [nom, prenom, email, motDePasseHash],
        (err, result) => {

            if (err) {

    console.log(err);

    if (err.code === "ER_DUP_ENTRY") {

        return res.status(400).json({
            message: "Cet email est déjà utilisé."
        });

    }

    return res.status(500).json({
        message: "Erreur serveur."
    });

}


            res.json({

                message: "Utilisateur créé avec succès",

                id: result.insertId

            });


        }
    );


});




router.post("/login", async (req, res) => {

    const { email, motDePasse } = req.body;


    const sql = `
        SELECT * FROM utilisateurs
        WHERE email = ?
    `;


    db.query(
        sql,
        [email],
        async (err, result) => {


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

            const utilisateur = result[0];

            const motDePasseValide = await bcrypt.compare(
                motDePasse,
                utilisateur.motDePasse
            );

            if (!motDePasseValide) {

                return res.status(401).json({
                message: "Email ou mot de passe incorrect"
           });

        }

            res.json({

                message: "Connexion réussie",

                utilisateur: {

                    id: utilisateur.id,
                    nom: utilisateur.nom,
                    prenom: utilisateur.prenom,
                    email: utilisateur.email,
                    dateCreation: utilisateur.dateCreation

                }

            });


        }
    );


});


module.exports = router;