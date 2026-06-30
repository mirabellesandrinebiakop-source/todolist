class TodoApp {

constructor() {

    const saved = localStorage.getItem("utilisateurConnecte");

    this.utilisateur = saved ? JSON.parse(saved) : null;
    this.tasks = this.utilisateur?.todos || [];

    this.render();
    this.updateCounter();
}

addTask() {

    if (!this.utilisateur) return alert("Connectez-vous");

    const text = taskInput.value.trim();
    if (!text) return;

    const priority = prompt("Priorité (haute/moyenne/basse)", "moyenne") || "moyenne";

    this.tasks.unshift({
        texte: text,
        termine: false,
        priority
    });

    taskInput.value = "";

    this.save();
    this.render();
}

deleteTask(i) {
    this.tasks.splice(i, 1);
    this.save();
    this.render();
}

toggleTask(i) {
    this.tasks[i].termine = !this.tasks[i].termine;
    this.save();
    this.render();
}
filterTasks(type) {

    this.render(type);

}
render(filter = "all") {

    let data = [...this.tasks];

    if (filter === "active") data = data.filter(t => !t.termine);
    if (filter === "completed") data = data.filter(t => t.termine);

    taskList.innerHTML = "";

    data.forEach((t) => {

    const index = this.tasks.indexOf(t);

    taskList.innerHTML += `
    <li>
        <span onclick="todoApp.toggleTask(${index})"
            class="${t.termine ? 'completed' : ''}">
            ${t.texte}
        </span>

        <small class="priority">${t.priority}</small>

        <button onclick="todoApp.deleteTask(${index})">❌</button>
    </li>`;
});

    this.updateCounter();
}

save() {

    this.utilisateur.todos = this.tasks;

    let users = JSON.parse(localStorage.getItem("utilisateurs")) || [];

    const index = users.findIndex(u => u.email === this.utilisateur.email);

    if (index !== -1) users[index] = this.utilisateur;

    localStorage.setItem("utilisateurs", JSON.stringify(users));
    localStorage.setItem("utilisateurConnecte", JSON.stringify(this.utilisateur));
}

updateCounter() {

    const total = this.tasks.length;
    const rest = this.tasks.filter(t => !t.termine).length;

    taskCounter.textContent = `${total} tâches • ${rest} restantes`;
}

toggleDarkMode() {
    document.body.classList.toggle("dark");
}

clearCompleted() {
    this.tasks = this.tasks.filter(t => !t.termine);
    this.save();
    this.render();
}
sortByPriority() {

    const ordre = {
        haute: 1,
        moyenne: 2,
        basse: 3
    };

    this.tasks.sort((a, b) => ordre[a.priority] - ordre[b.priority]);

    this.save();
    this.render();

}
searchTask(value) {

    const result = this.tasks.filter(t =>
        t.texte.toLowerCase().includes(value.toLowerCase())
    );

    taskList.innerHTML = "";

    result.forEach((t, i) => {

        taskList.innerHTML += `
        <li>${t.texte} - ${t.priority}</li>`;
    });
}
}