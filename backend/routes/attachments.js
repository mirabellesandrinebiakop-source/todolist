const express = require("express");

const router = express.Router();

const db = require("../database");

const auth = require("../middleware/auth");


router.get("/", auth, (req, res) => {

    const utilisateur_id = req.utilisateur.id;

    const search = req.query.search || "";


    let sql = `
        SELECT *
        FROM attachments
        WHERE utilisateur_id = ?
    `;


    let params = [utilisateur_id];


    if (search) {

        sql += `
            AND (
                nom LIKE ?
                OR type LIKE ?
            )
        `;

        params.push(
            `%${search}%`,
            `%${search}%`
        );

    }


    sql += `
        ORDER BY dateCreation DESC
    `;


    db.query(
        sql,
        params,
        (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Erreur lors de la récupération des fichiers."
                });

            }


            res.json(results);

        }
    );

});

router.post("/", auth, (req, res) => {

    const utilisateur_id = req.utilisateur.id;

    const {
        nom,
        type,
        chemin
    } = req.body;


    if (!nom) {

        return res.status(400).json({
            message: "Le nom du fichier est obligatoire."
        });

    }


    const sql = `
        INSERT INTO attachments
        (utilisateur_id, nom, type, chemin)
        VALUES (?, ?, ?, ?)
    `;


    db.query(

        sql,

        [
            utilisateur_id,
            nom,
            type || null,
            chemin || null
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Erreur lors de la création du fichier."
                });

            }


            res.json({

                message: "Attachment créé avec succès.",

                id: result.insertId

            });

        }

    );

});

router.delete("/:id", auth, (req, res) => {

    const utilisateur_id = req.utilisateur.id;

    const attachment_id = req.params.id;


    const sql = `
        DELETE FROM attachments
        WHERE id = ? AND utilisateur_id = ?
    `;


    db.query(

        sql,

        [
            attachment_id,
            utilisateur_id
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Erreur lors de la suppression du fichier."
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Fichier introuvable."
                });

            }


            res.json({
                message: "Attachment supprimé avec succès."
            });

        }

    );

});

module.exports = router;