class TodoApp {

constructor() {

    this.taskInput = document.getElementById("taskInput");
    this.taskList = document.getElementById("taskList");
    this.taskCounter = document.getElementById("taskCounter");

    const saved = localStorage.getItem("utilisateurConnecte");
    this.utilisateur = saved ? JSON.parse(saved) : null;

    this.manager = new TodoManager(this.utilisateur);

    this.render();
}

addTask() {

    const text = this.taskInput.value.trim();

    if (!text) {
        alert("Veuillez saisir une tâche.");
        return;
    }

    const finalPriority = document.getElementById("prioritySelect").value;

    const todo = new Todo(
        Date.now(),
        text,
        "",
        "a faire",
        finalPriority
    );

    this.manager.add(todo);

    this.taskInput.value = "";

    document.getElementById("prioritySelect").value = "moyenne";

    this.render();
}

editTask(id) {

    const todo = this.manager.getAll().find(t => t.id === id);
    if (!todo) return;

    const nouveauTitre = prompt("Nouveau titre :", todo.titre);
    if (!nouveauTitre) return;

    const nouvellePriorite = prompt(
        "Priorité (haute / moyenne / basse) :",
        todo.priorite
    );

    this.manager.update(id, {
        titre: nouveauTitre,
        priorite: nouvellePriorite || todo.priorite
    });

    this.render();
}

deleteTask(id) {
    this.manager.delete(id);
    this.render();
}

toggleTask(id) {
    this.manager.toggle(id);
    this.render();
}

filterTasks(type) {
    this.render(type);
}

render(filter = "all") {
    
    const all = this.manager.getAll();
    let data = [...all];

    if (filter === "active") {
        data = data.filter(t => t.statut !== "terminee");
    }

    if (filter === "completed") {
        data = data.filter(t => t.statut === "terminee");
    }

    this.taskList.innerHTML = "";

    data.forEach(todo => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span onclick="todoApp.toggleTask(${todo.id})"
                class="${(todo.statut || '') === 'terminee' ? 'completed' : ''}">
                ${todo.titre}
            </span>

            <small class="priority ${todo.priorite}">
                ${todo.priorite}
            </small>

            <button onclick="todoApp.deleteTask(${todo.id})">❌</button>
            <button onclick="todoApp.editTask(${todo.id})">✏️</button>
        `;

        this.taskList.appendChild(li);
    });

    this.updateCounter();
}

updateCounter() {

    const todos = this.manager.getAll();

    const total = todos.length;
    const rest = todos.filter(t => t.statut !== "terminee").length;

    this.taskCounter.textContent =
        `${total} tâches • ${rest} restantes`;
}

clearCompleted() {
    this.manager.clearCompleted();
    this.render();
}

sortByPriority() {

    const ordre = { haute: 1, moyenne: 2, basse: 3 };

    const data = this.manager.getAll();

    data.sort((a, b) =>
        (ordre[a.priorite] ?? 99) - (ordre[b.priorite] ?? 99)
    );

    this.render();
}

searchTask(value) {

    const data = this.manager.getAll().filter(t =>
        t.titre.toLowerCase().includes(value.toLowerCase())
    );

    this.taskList.innerHTML = "";

    data.forEach(todo => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span onclick="todoApp.toggleTask(${todo.id})"
                class="${todo.statut === 'terminee' ? 'completed' : ''}">
                ${todo.titre}
            </span>

            <small>${todo.priorite}</small>

            <button onclick="todoApp.deleteTask(${todo.id})">❌</button>
            <button onclick="todoApp.editTask(${todo.id})">✏️</button>
        `;

        this.taskList.appendChild(li);
    });
}

toggleDarkMode() {
    document.body.classList.toggle("dark");
}

}