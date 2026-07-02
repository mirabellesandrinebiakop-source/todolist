class TodoManager {

constructor(utilisateur) {
    this.utilisateur = utilisateur;

    if (!this.utilisateur.todos) {
        this.utilisateur.todos = [];
    }
}

getAll() {
    return this.utilisateur.todos;
}

add(todo) {
    this.utilisateur.todos.unshift(todo);
    this.save();
}

delete(id) {
    this.utilisateur.todos =
        this.utilisateur.todos.filter(t => t.id !== id);

    this.save();
}

toggle(id) {

    const todo = this.utilisateur.todos.find(t => t.id === id);
    if (!todo) return;

    todo.statut =
        todo.statut === "terminee" ? "a faire" : "terminee";

    todo.dateFin = todo.statut === "terminee" ? new Date() : null;

    this.save();
}

update(id, data) {

    const index = this.utilisateur.todos.findIndex(t => t.id === id);

    if (index === -1) return;

    this.utilisateur.todos[index] = {
        ...this.utilisateur.todos[index],
        ...data
    };

    this.save();
}

clearCompleted() {
    this.utilisateur.todos =
        this.utilisateur.todos.filter(t => t.statut !== "terminee");

    this.save();
}

save() {

    let users = JSON.parse(localStorage.getItem("utilisateurs")) || [];

    const index = users.findIndex(u => u.email === this.utilisateur.email);

    if (index !== -1) {
        users[index] = this.utilisateur;
    }

    localStorage.setItem("utilisateurs", JSON.stringify(users));
    localStorage.setItem("utilisateurConnecte", JSON.stringify(this.utilisateur));
}

}