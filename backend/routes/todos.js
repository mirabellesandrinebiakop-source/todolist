const express = require("express");
const router = express.Router();

const db = require("../database");


router.post("/", (req, res) => {

    console.log("Tâche reçue :", req.body);

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


router.delete("/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM todos
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Erreur lors de la suppression."
            });

        }

        res.json({
            message: "Tâche supprimée avec succès."
        });

    });

});

router.put("/:id", (req,res)=>{

    const id = req.params.id;

    console.log("ID reçu :", id);
    console.log("BODY reçu :", req.body);

    const {
        titre,
        description,
        priorite,
        statut,
        dateFin
    } = req.body;


    console.log("DONNEES RECUES :", req.body);


    const sql = `
    UPDATE todos
    SET 
        titre = COALESCE(?, titre),
        description = COALESCE(?, description),
        priorite = COALESCE(?, priorite),
        statut = COALESCE(?, statut),
        dateFin = COALESCE(?, dateFin)
    WHERE id = ?
    `;


    db.query(
        sql,
        [
            titre || null,
            description || null,
            priorite || null,
            statut || null,
            dateFin || null,
            id
        ],
        (err,result)=>{


            if(err){

                console.log(err);

                return res.status(500).json({
                    message:"Erreur modification tâche"
                });

            }


            res.json({
                message:"Tâche modifiée avec succès"
            });


        }
    );

});

module.exports = router;