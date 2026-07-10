class Utilisateur {

    constructor(id, nom, prenom, age, email, motDePasse, todos = []) {

        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.age = age;
        this.email = email;
        this.motDePasse = motDePasse;
        this.todos = todos;
    }
    
    getNomComplet() {

        return this.prenom + " " + this.nom;

    }

    verifierMotDePasse(motDePasse) {

    return this.motDePasse === motDePasse;

    }

    modifierMotDePasse(nouveauMotDePasse) {

        this.motDePasse = nouveauMotDePasse;

    }

    estMajeur() {

    return this.age >= 18;

}

modifierInformations(nom, prenom, age, email) {

    this.nom = nom;
    this.prenom = prenom;
    this.age = age;
    this.email = email;

}

toJSON() {

    return {
        id: this.id,
        nom: this.nom,
        prenom: this.prenom,
        age: this.age,
        email: this.email,
        motDePasse: this.motDePasse,
        todos: this.todos
    };

}

}