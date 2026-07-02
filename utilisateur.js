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

    ajouterTodo(todo) {
        this.todos.unshift(todo);
    }

    supprimerTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
    }

    modifierTodo(id, nouvellesDonnees) {
        const index = this.todos.findIndex(t => t.id === id);

        if (index !== -1) {
            this.todos[index] = {
                ...this.todos[index],
                ...nouvellesDonnees
            };
        }
    }

    validerTodo(id) {
        const todo = this.todos.find(t => t.id === id);

        if (todo) {
            todo.statut = "Terminée";
            todo.dateFin = new Date();
        }
    }

    getTodos() {
        return this.todos;
    }

}