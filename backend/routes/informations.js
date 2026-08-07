const express = require("express");

const router = express.Router();

const db = require("../database");


router.get("/:type", (req, res) => {

    const type = req.params.type;


    const sql = `
        SELECT titre, contenu
        FROM informations
        WHERE type = ?
    `;


    db.query(
        sql,
        [type],
        (err, result) => {


            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Erreur serveur."
                });

            }


            if (result.length === 0) {

                return res.status(404).json({
                    message: "Information introuvable."
                });

            }


            res.json(result[0]);


        }
    );


});


module.exports = router;