class Utilisateur {

    constructor(nom, email, motDePasse, todos = []) {

        this.nom = nom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.todos = todos;

    }

}