class Utilisateur {

    constructor(id, nom, prenom, email, motDePasse) {

        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;

        this.todos = [];

    }

    getNomComplet() {

        return `${this.prenom} ${this.nom}`;

    }

    verifierMotDePasse(motDePasse) {

        return this.motDePasse === motDePasse;

    }

    modifierMotDePasse(nouveauMotDePasse) {

        this.motDePasse = nouveauMotDePasse;

    }

    toJSON() {

        return {

            id: this.id,
            nom: this.nom,
            prenom: this.prenom,
            email: this.email,
            motDePasse: this.motDePasse,
            todos: this.todos

        };

    }

}