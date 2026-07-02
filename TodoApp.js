class TodoApp{
                                                                                                
constructor() {

    const saved = localStorage.getItem("utilisateurConnecte");

    this.utilisateur = saved ? JSON.parse(saved) : null;

    this.manager = new TodoManager(this.utilisateur);

    this.tasks = this.manager.getTodos();

    this.render();
    this.updateCounter();
}

addTask() {

    if (!this.utilisateur) return alert("Connectez-vous");

    const text = taskInput.value.trim();
    if (!text) return;

    const priority = prompt("Priorité (haute/moyenne/basse)", "moyenne");

    const todo = new Todo(
        Date.now(),
        text,
        "",
        "À faire",
        priority || "moyenne",
        new Date(),
        null
    );

    this.manager.add(todo);

    this.tasks = this.manager.getTodos();

    taskInput.value = "";

    this.save();
    this.render();
    console.log(this.tasks);
}

deleteTask(i) {

    const todo = this.tasks[i];

    this.manager.delete(todo.id);

    this.tasks = this.manager.getTodos();

    this.save();
    this.render();
}

toggleTask(i) {

    const todo = this.tasks[i];

    this.manager.toggle(todo.id);

    this.tasks = this.manager.getTodos();

    this.save();
    this.render();
}
filterTasks(type) {

    this.render(type);

}
render(filter = "all") {

    let data = [...this.tasks];

    if (filter === "active") {
        data = data.filter(t => t.statut !== "Terminée");
    }

    if (filter === "completed") {
        data = data.filter(t => t.statut === "Terminée");
    }

    taskList.innerHTML = "";

    data.forEach((t) => {

        const realIndex = this.tasks.findIndex(x => x.id === t.id);

        const li = document.createElement("li");

        li.innerHTML = `
            <span onclick="todoApp.toggleTask(${realIndex})"
                class="${t.statut === 'Terminée' ? 'completed' : ''}">
                ${t.titre}
            </span>

            <small class="priority">${t.priorite}</small>

            <div>
                <button onclick="todoApp.editTask(${realIndex})">✏️</button>
                <button onclick="todoApp.deleteTask(${realIndex})">❌</button>
            </div>
        `;

        taskList.appendChild(li);
    });

    this.updateCounter();
}

save() {

    this.sync();

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

    this.tasks.sort((a, b) => ordre[a.priorite] - ordre[b.priorite]);

    this.save();
    this.render();

}
searchTask(value) {

    const result = this.tasks.filter(t =>
        t.titre.toLowerCase().includes(value.toLowerCase())
    );

    taskList.innerHTML = "";

    result.forEach((t, i) => {

        taskList.innerHTML += `
        <li>${t.titre} - ${t.priorite}</li>`;
    });
}
sync() {
    this.utilisateur.todos = this.tasks;
}
editTask(i) {

    const todo = this.tasks[i];

    const nouveauTitre = prompt("Nouveau titre :", todo.titre);
    if (!nouveauTitre) return;

    const nouvellePriorite = prompt("Priorité (haute/moyenne/basse) :", todo.priorite);

    this.tasks[i] = todo.copyWith({
        titre: nouveauTitre,
        priorite: nouvellePriorite
    });

    this.save();
    this.render();
}
}