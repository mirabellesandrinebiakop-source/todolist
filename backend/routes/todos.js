const express = require("express");
const router = express.Router();

const db = require("../database");


router.post("/", (req, res) => {

    const {
        utilisateur_id,
        titre,
        description,
        priorite,
        dateFin
    } = req.body;


    const sql = `
        INSERT INTO todos
        (utilisateur_id, titre, description, priorite, dateFin)
        VALUES (?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            utilisateur_id,
            titre,
            description,
            priorite,
            dateFin
        ],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Erreur lors de l'ajout de la tâche"
                });
            }


            res.json({
                message: "Tâche créée avec succès",
                id: result.insertId
            });

        }
    );

});


router.get("/:utilisateur_id", (req, res) => {

    const utilisateur_id = req.params.utilisateur_id;


    const sql = `
        SELECT * FROM todos
        WHERE utilisateur_id = ?
    `;


    db.query(
        sql,
        [utilisateur_id],
        (err, results) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Erreur récupération des tâches"
                });
            }


            res.json(results);

        }
    );

});


module.exports = router;