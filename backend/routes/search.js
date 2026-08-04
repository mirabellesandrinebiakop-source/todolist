const express = require("express");

const router = express.Router();

const db = require("../database");

const auth = require("../middleware/auth");

router.get("/", auth, (req, res) => {

    const utilisateur_id = req.utilisateur.id;

    const query = req.query.query || "";

    const search = `%${query}%`;

    const resultats = {
        tasks: [],
        projects: [],
        attachments: []
    };


    const sqlTasks = `
        SELECT *
        FROM todos
        WHERE utilisateur_id = ?
        AND (
            titre LIKE ?
            OR description LIKE ?
        )
        ORDER BY dateCreation DESC
    `;

    db.query(
        sqlTasks,
        [utilisateur_id, search, search],
        (err, tasks) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Erreur lors de la recherche des tâches."
                });

            }

            resultats.tasks = tasks;


            const sqlProjects = `
                SELECT *
                FROM projects
                WHERE utilisateur_id = ?
                AND (
                    nom LIKE ?
                    OR description LIKE ?
                )
                ORDER BY dateCreation DESC
            `;

            db.query(
                sqlProjects,
                [utilisateur_id, search, search],
                (err, projects) => {

                    if (err) {

                        console.log(err);

                        return res.status(500).json({
                            message: "Erreur lors de la recherche des projets."
                        });

                    }

                    resultats.projects = projects;


                    const sqlAttachments = `
                        SELECT *
                        FROM attachments
                        WHERE utilisateur_id = ?
                        AND (
                            nom LIKE ?
                            OR type LIKE ?
                        )
                        ORDER BY dateCreation DESC
                    `;

                    db.query(
                        sqlAttachments,
                        [utilisateur_id, search, search],
                        (err, attachments) => {

                            if (err) {

                                console.log(err);

                                return res.status(500).json({
                                    message: "Erreur lors de la recherche des fichiers."
                                });

                            }

                            resultats.attachments = attachments;

                            res.json(resultats);

                        }

                    );

                }

            );

        }

    );

});

module.exports = router;