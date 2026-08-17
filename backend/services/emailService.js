const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }

});


async function envoyerEmail(
    destinataire,
    sujet,
    message
) {

    try {

        const info = await transporter.sendMail({

            from: `"TodoApp Pro" <${process.env.EMAIL_USER}>`,

            to: destinataire,

            subject: sujet,

            text: message

        });


        console.log(
            "Email envoyé :",
            info.messageId
        );


        return true;


    } catch (error) {

        console.error(
            "Erreur envoi email :",
            error
        );


        return false;

    }

}


module.exports = {
    envoyerEmail
};