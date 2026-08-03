const express = require("express");

const router = express.Router();

const db = require("../database");

const auth = require("../middleware/auth");

router.get("/", auth, (req, res) => {

    const utilisateur_id = req.utilisateur.id;

    const search = req.query.search || "";

    console.log("Recherche reçue :", search);

    let sql = `
        SELECT *
        FROM projects
        WHERE utilisateur_id = ?
    `;

    let params = [utilisateur_id];


    if (search) {

        sql += `
            AND (
                nom LIKE ?
                OR description LIKE ?
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
                    message: "Erreur lors de la récupération des projets."
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
        description,
        couleur
    } = req.body;

    console.log("Projet reçu :", req.body);
    console.log("Utilisateur :", req.utilisateur);

    if (!nom) {

        return res.status(400).json({
            message: "Le nom du projet est obligatoire."
        });

    }

    const sql = `
        INSERT INTO projects
        (utilisateur_id, nom, description, couleur)
        VALUES (?, ?, ?, ?)
    `;

    db.query(

        sql,

        [
            utilisateur_id,
            nom,
            description || null,
            couleur || "#2563eb"
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Erreur lors de la création du projet."
                });

            }

            res.json({

                message: "Projet créé avec succès.",

                id: result.insertId

            });

        }

    );

});

router.put("/:id", auth, (req, res) => {

    const utilisateur_id = req.utilisateur.id;

    const project_id = req.params.id;

    const {
        nom,
        description,
        couleur
    } = req.body;


    const sql = `
        UPDATE projects
        SET nom = ?, description = ?, couleur = ?
        WHERE id = ? AND utilisateur_id = ?
    `;


    db.query(

        sql,

        [
            nom,
            description,
            couleur,
            project_id,
            utilisateur_id
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Erreur lors de la modification du projet."
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Projet introuvable."
                });

            }


            res.json({
                message: "Projet modifié avec succès."
            });

        }

    );

});

router.delete("/:id", auth, (req, res) => {

    const utilisateur_id = req.utilisateur.id;

    const project_id = req.params.id;


    const sql = `
        DELETE FROM projects
        WHERE id = ? AND utilisateur_id = ?
    `;


    db.query(

        sql,

        [
            project_id,
            utilisateur_id
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Erreur lors de la suppression du projet."
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Projet introuvable."
                });

            }


            res.json({
                message: "Projet supprimé avec succès."
            });

        }

    );

});

module.exports = router;