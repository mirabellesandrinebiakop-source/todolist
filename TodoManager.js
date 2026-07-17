class TodoManager {

constructor(utilisateur) {

    this.utilisateur = utilisateur;

    if (!this.utilisateur) {
        throw new Error("Aucun utilisateur connecté.");
    }

    if (!Array.isArray(this.utilisateur.todos)) {
        this.utilisateur.todos = [];
    }

}

getAll() {
    return this.utilisateur.todos;
}

findById(id) {

    return this.utilisateur.todos.find(
        t => t.id === id
    );

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

    const todo = this.findById(id);

    if (!todo) return;


    if (todo.statut === "terminee") {

        todo.statut = "a faire";
        todo.dateFin = null;

    } else {

        todo.statut = "terminee";
        todo.dateFin = new Date();

    }


    this.save();

}

update(id, data) {

    const index = this.utilisateur.todos.findIndex(t => t.id === id);

    if (index === -1) return;

    const todo = this.utilisateur.todos[index];

    todo.titre = data.titre ?? todo.titre;
    todo.description = data.description ?? todo.description;
    todo.priorite = data.priorite ?? todo.priorite;
    todo.statut = data.statut ?? todo.statut;
    todo.dateFin = data.dateFin ?? todo.dateFin;

    this.save();

}

clearCompleted() {

    this.utilisateur.todos =
        this.utilisateur.todos.filter(

            t => t.statut !== "terminee"

        );

    this.save();

}
countTotal() {

    return this.utilisateur.todos.length;

}

countCompleted(){

    return this.utilisateur.todos.filter(

        t => t.statut === "terminee"

    ).length;

}

countPending() {

    return this.utilisateur.todos.filter(

        t => t.statut !== "terminee"

    ).length;

}

search(text) {

    return this.utilisateur.todos.filter(

        t => t.titre.toLowerCase()
        .includes(text.toLowerCase())

    );

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

sortByPriority() {

    const ordre = {

        haute: 1,
        moyenne: 2,
        basse: 3

    };

    this.utilisateur.todos.sort(

        (a, b) =>

        ordre[a.priorite] - ordre[b.priorite]

    );

    this.save();

}

countHighPriority() {

    return this.utilisateur.todos.filter(

        t => t.priorite === "haute"

    ).length;

}

countOverdue() {

    const aujourdHui = new Date();

    return this.utilisateur.todos.filter(todo => {

        if (!todo.dateLimite) {
            return false;
        }

        return (
            todo.statut !== "terminee" &&
            new Date(todo.dateLimite) < aujourdHui
        );

    }).length;

}

moveUp(id) {

    const index = this.utilisateur.todos.findIndex(
        t => t.id === id
    );

    if (index <= 0) return;

    [
        this.utilisateur.todos[index - 1],
        this.utilisateur.todos[index]
    ] = [
        this.utilisateur.todos[index],
        this.utilisateur.todos[index - 1]
    ];

    this.save();

}

moveDown(id) {

    const index = this.utilisateur.todos.findIndex(
        t => t.id === id
    );

    if (index === -1 || index >= this.utilisateur.todos.length - 1) return;

    [
        this.utilisateur.todos[index],
        this.utilisateur.todos[index + 1]
    ] = [
        this.utilisateur.todos[index + 1],
        this.utilisateur.todos[index]
    ];

    this.save();

}

}