class TodoManager {

    constructor(utilisateur) {
        this.utilisateur = utilisateur;
    }

    getTodos() {
        return this.utilisateur.todos;
    }

    add(todo) {
        this.utilisateur.todos.unshift(todo);
    }

    delete(id) {
        this.utilisateur.todos =
            this.utilisateur.todos.filter(t => t.id !== id);
    }

    toggle(id) {
        const todo = this.utilisateur.todos.find(t => t.id === id);

        if (!todo) return;

        todo.statut = todo.statut === "Terminée" ? "À faire" : "Terminée";
        todo.dateFin = todo.statut === "Terminée" ? new Date() : null;
    }

    clearCompleted() {
        this.utilisateur.todos =
            this.utilisateur.todos.filter(t => t.statut !== "Terminée");
    }
}