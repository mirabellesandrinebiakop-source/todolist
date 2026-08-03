const jwt = require("jsonwebtoken");

function auth(req, res, next) {

    console.log("=== AUTH ===");
    console.log("Headers :", req.headers);
    console.log("Authorization :", req.headers.authorization);

    const header = req.headers.authorization;

    if (!header) {

        return res.status(401).json({
            message: "Token manquant."
        });

    }

    const token = header.split(" ")[1];

    try {

        const utilisateur = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.utilisateur = utilisateur;

        console.log("Utilisateur connecté :", utilisateur);

        next();

    } catch (error) {

        console.log(error);

        if (error.name === "TokenExpiredError") {

            return res.status(401).json({
                message: "Votre session a expiré. Veuillez vous reconnecter."
            });

        }

        return res.status(401).json({
            message: "Token invalide."
        });

    }

}

module.exports = auth;