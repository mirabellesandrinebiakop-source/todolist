const express = require("express");

const router = express.Router();

const db = require("../database");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const auth = require("../middleware/auth");

router.post("/register", async (req, res) => {

    try {

        const { nom, prenom, email, motDePasse } = req.body;


        if (!nom || !prenom || !email || !motDePasse) {

            return res.status(400).json({

                message: "Tous les champs sont obligatoires."

            });

        }


        const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailValide.test(email)) {

            return res.status(400).json({

                message: "Adresse email invalide."

            });

        }


        if (motDePasse.length < 8) {

            return res.status(400).json({

                message: "Le mot de passe doit contenir au moins 8 caractères."

            });

        }


        const motDePasseHash = await bcrypt.hash(motDePasse, 10);

    const sql = `
    INSERT INTO utilisateurs
    (nom, prenom, email, motDePasse, plan, debutEssai, finEssai)
    VALUES (?, ?, ?, ?, 'free', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))
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


}

    catch(error){

        console.log(error);

        res.status(500).json({

            message:"Erreur serveur."

        });

    }


});


router.post("/login", async (req, res) => {

    console.log(req.body);

    try {

        const { email, motDePasse } = req.body;


        if (!email || !motDePasse) {

            return res.status(400).json({

                message: "Email et mot de passe sont obligatoires."

            });

        }


        const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailValide.test(email)) {

            return res.status(400).json({

                message: "Adresse email invalide."

            });

        }


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


                const token = jwt.sign(

    {
        id: utilisateur.id,
        email: utilisateur.email
    },

    process.env.JWT_SECRET,

    {
        expiresIn: "24h"
    }

);

                res.json({

                    message: "Connexion réussie",

                    token,

                    utilisateur: {

    id: utilisateur.id,
    nom: utilisateur.nom,
    prenom: utilisateur.prenom,
    email: utilisateur.email,
    dateCreation: utilisateur.dateCreation,

    plan: utilisateur.plan,
    debutEssai: utilisateur.debutEssai,
    finEssai: utilisateur.finEssai

}

                });

            }

        );

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Erreur serveur."

        });

    }

});

router.get("/", (req, res) => {


    const sql = `
        SELECT id, nom, prenom, email, dateCreation
        FROM utilisateurs
    `;


    db.query(sql, (err, result) => {


        if(err){

            console.log(err);

            return res.status(500).json({

                message:"Erreur serveur."

            });

        }


        res.json(result);


    });


});

router.get("/subscription", auth, (req, res) => {

    const id = req.utilisateur.id;

    const sql = `
        SELECT
            id,
            plan,
            debutEssai,
            finEssai,
            finAbonnement
        FROM utilisateurs
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Erreur serveur."
            });

        }

        if (result.length === 0) {

            return res.status(404).json({
                message: "Utilisateur introuvable."
            });

        }

        res.json(result[0]);

    });

});

router.get("/subscription/check", auth, (req, res) => {

    const utilisateur_id = req.utilisateur.id;


    const sql = `
        SELECT
            id,
            plan,
            debutEssai,
            finEssai,
            finAbonnement
        FROM utilisateurs
        WHERE id = ?
    `;


    db.query(
        sql,
        [utilisateur_id],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Erreur serveur."
                });

            }


            if (result.length === 0) {

                return res.status(404).json({
                    message: "Utilisateur introuvable."
                });

            }


            const utilisateur = result[0];



            if (
                utilisateur.plan === "premium" &&
                utilisateur.finAbonnement &&
                new Date(utilisateur.finAbonnement) <= new Date()
            ) {

                const updateSql = `
                    UPDATE utilisateurs
                    SET plan = 'free',
                        finAbonnement = NULL
                    WHERE id = ?
                `;


                db.query(
                    updateSql,
                    [utilisateur_id],
                    (updateErr) => {

                        if (updateErr) {

                            console.log(updateErr);

                            return res.status(500).json({
                                message: "Erreur lors de l'expiration de l'abonnement."
                            });

                        }


                        return res.json({

                            id: utilisateur.id,

                            plan: "free",

                            debutEssai: utilisateur.debutEssai,

                            finEssai: utilisateur.finEssai,

                            finAbonnement: null,

                            abonnementExpire: true

                        });

                    }
                );


                return;

            }


            res.json({

                id: utilisateur.id,

                plan: utilisateur.plan,

                debutEssai: utilisateur.debutEssai,

                finEssai: utilisateur.finEssai,

                finAbonnement: utilisateur.finAbonnement,

                abonnementExpire: false

            });

        }
    );

});

router.post("/upgrade", auth, (req, res) => {

    const utilisateur_id = req.utilisateur.id;

    const { plan } = req.body;


    if (plan !== "monthly" && plan !== "yearly") {

        return res.status(400).json({
            message: "Plan d'abonnement invalide."
        });

    }


    let duree;


    if (plan === "monthly") {

        duree = 1;

    } else {

        duree = 12;

    }


    const sql = `
        UPDATE utilisateurs

        SET
            plan = 'premium',
            finAbonnement = DATE_ADD(
                NOW(),
                INTERVAL ? MONTH
            )

        WHERE id = ?
    `;


    db.query(
        sql,
        [duree, utilisateur_id],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Erreur lors de l'activation de l'abonnement."
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Utilisateur introuvable."
                });

            }


            res.json({

                message: "Abonnement activé avec succès.",

                plan: "premium",

                finAbonnement: null

            });

        }
    );

});

router.get("/:id", (req, res) => {


    const id = req.params.id;


    const sql = `
        SELECT id, nom, prenom, email, dateCreation
        FROM utilisateurs
        WHERE id = ?
    `;


    db.query(sql, [id], (err, result) => {


        if(err){

            return res.status(500).json({

                message:"Erreur serveur."

            });

        }


        if(result.length === 0){

            return res.status(404).json({

                message:"Utilisateur introuvable."

            });

        }


        res.json(result[0]);


    });


});


router.put("/:id", async (req, res) => {


    try {


        const id = req.params.id;


        const { nom, prenom, email, motDePasse } = req.body;



        if(!nom || !prenom || !email){

            return res.status(400).json({

                message:"Nom, prénom et email sont obligatoires."

            });

        }



        let sql;
        let valeurs;



        if(motDePasse){


            if(motDePasse.length < 8){

                return res.status(400).json({

                    message:"Le mot de passe doit contenir au moins 8 caractères."

                });

            }



            const motDePasseHash = await bcrypt.hash(
                motDePasse,
                10
            );



            sql = `

                UPDATE utilisateurs

                SET nom = ?, prenom = ?, email = ?, motDePasse = ?

                WHERE id = ?

            `;



            valeurs = [

                nom,
                prenom,
                email,
                motDePasseHash,
                id

            ];



        }else{


            sql = `

                UPDATE utilisateurs

                SET nom = ?, prenom = ?, email = ?

                WHERE id = ?

            `;



            valeurs = [

                nom,
                prenom,
                email,
                id

            ];


        }




        db.query(sql, valeurs, (err, result)=>{


            if(err){


                console.log(err);


                if(err.code === "ER_DUP_ENTRY"){

                    return res.status(400).json({

                        message:"Cet email est déjà utilisé."

                    });

                }


                return res.status(500).json({

                    message:"Erreur serveur."

                });


            }



            if(result.affectedRows === 0){

                return res.status(404).json({

                    message:"Utilisateur introuvable."

                });

            }



            res.json({

                message:"Utilisateur modifié avec succès."

            });



        });



    }

    catch(error){


        console.log(error);


        res.status(500).json({

            message:"Erreur serveur."

        });


    }


});


router.delete("/:id", (req, res) => {


    const id = req.params.id;


    const sql = `

        DELETE FROM utilisateurs

        WHERE id = ?

    `;



    db.query(sql, [id], (err, result) => {


        if(err){

            console.log(err);


            return res.status(500).json({

                message:"Erreur serveur."

            });

        }



        if(result.affectedRows === 0){

            return res.status(404).json({

                message:"Utilisateur introuvable."

            });

        }



        res.json({

            message:"Utilisateur supprimé avec succès."

        });


    });


});

module.exports = router;