const jwt = require("jsonwebtoken");

function auth(req, res, next) {

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

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Token invalide."
        });

    }

}

module.exports = auth;