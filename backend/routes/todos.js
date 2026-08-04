const express = require("express");
const router = express.Router();
const db = require("../database");
const auth = require("../middleware/auth");


router.post("/", auth, (req, res) => {


    console.log("Tâche reçue :", req.body);


    const utilisateur_id = req.utilisateur.id;

    const {
        titre,
        description,
        priorite,
        dateFin
    } = req.body;
    

    if(!titre){

        return res.status(400).json({

            message:"Le titre est obligatoire."

        });

    }



    const prioriteFinale = priorite || "moyenne";

    const descriptionFinale = description || null;


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
            descriptionFinale,
            prioriteFinale,
            dateFin || null
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


router.get("/", auth, (req, res) => {

    const utilisateur_id = req.utilisateur.id;
    console.log("Utilisateur connecté :", req.utilisateur);

    const sql = `
        SELECT *
        FROM todos
        WHERE utilisateur_id = ?
        ORDER BY position ASC, dateCreation DESC
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


router.delete("/:id", auth, (req, res) => {

    const id = req.params.id;

    const utilisateur_id = req.utilisateur.id;


    const sql = `
        DELETE FROM todos
        WHERE id = ?
        AND utilisateur_id = ?
    `;


    db.query(
        sql,
        [id, utilisateur_id],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Erreur lors de la suppression."
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Tâche introuvable ou non autorisée."
                });

            }


            res.json({
                message: "Tâche supprimée avec succès."
            });

        }
    );

});

router.put("/order", auth, (req, res) => {



    const utilisateur_id = req.utilisateur.id;



    const positions = req.body;

    

    console.log("POSITIONS RECUES :", positions);

    console.log("UTILISATEUR :", req.utilisateur.id);



    if (!Array.isArray(positions)) {



        return res.status(400).json({

            message: "Format incorrect."

        });



    }





    const queries = positions.map(item => {



        return new Promise((resolve, reject) => {



            const sql = `

                UPDATE todos

                SET position = ?

                WHERE id = ?

                AND utilisateur_id = ?

            `;





            db.query(

                sql,

                [

                    item.position,

                    item.id,

                    utilisateur_id

                ],

                (err, result) => {



                    if (err) {



                        reject(err);



                    } else {



                        resolve(result);



                    }



                }

            );



        });



    });





    Promise.all(queries)



    .then(() => {



        res.json({

            message: "Ordre des tâches mis à jour."

        });



    })



    .catch(error => {



        console.log(error);



        res.status(500).json({

            message: "Erreur mise à jour ordre."

        });



    });





});

router.delete("/completed/all", auth, (req, res) => {

    const utilisateur_id = req.utilisateur.id;


    const sql = `
        DELETE FROM todos
        WHERE utilisateur_id = ?
        AND statut = 'terminee'
    `;


    db.query(
        sql,
        [utilisateur_id],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Erreur suppression des tâches terminées."
                });

            }


            res.json({

                message: "Tâches terminées supprimées avec succès.",
                deleted: result.affectedRows

            });

        }
    );

});

router.put("/:id", auth, (req, res) => {

    const id = req.params.id;
    const utilisateur_id = req.utilisateur.id;

    console.log("ID reçu :", id);
    console.log("BODY reçu :", req.body);


    const {
        titre,
        description,
        priorite,
        statut,
        dateFin
    } = req.body;

    const dateMysql = dateFin
    ? dateFin.substring(0,10)
    : null;


    const sql = `
        UPDATE todos
        SET 
            titre = ?,
            description = ?,
            priorite = ?,
            statut = ?,
            dateFin = ?
            WHERE id = ?
            AND utilisateur_id = ?
    `;


    db.query(
        sql,
        [
            titre,
            description,
            priorite,
            statut,
            dateMysql,
            id,
            utilisateur_id
        ],

        (err,result)=>{

            if(err){

                console.log("ERREUR SQL :", err);

                return res.status(500).json({
                    message:"Erreur modification tâche"
                });

            }


            console.log("RESULTAT SQL :", result);
            
            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message:"Tâche introuvable ou non autorisée."
                });

            }

            res.json({
                message:"Tâche modifiée avec succès"
            });

        }
    );


});

module.exports = router;