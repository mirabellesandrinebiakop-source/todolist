class TodoApp {

constructor() {

        const saved = localStorage.getItem("utilisateurConnecte");

        this.utilisateur = saved ? JSON.parse(saved) : null;
        this.tasks = this.utilisateur?.todos || [];

        const welcome = document.getElementById("welcomeMessage");
        if (welcome && this.utilisateur) {
            welcome.textContent =
                "Bienvenue, " + this.utilisateur.nom + " 👋";
        }

        this.render();
        this.enableDragAndDrop();
        this.updateCounter();
}

    addTask() {

    if (!this.utilisateur) {
        this.showNotification(
            "Veuillez vous connecter !",
             "warning"
        );
        return;
    }

    let input = document.getElementById("taskInput");
    let text = input.value.trim();

    if (!text) return;

    let priority = prompt("Priorité (haute / moyenne / basse)", "moyenne");

    const valid = ["haute", "moyenne", "basse"];
    if (!valid.includes(priority)) priority = "moyenne";

    this.tasks.unshift({
        id: Date.now(),
        texte: text,
        termine: false,
        priority
    });

    input.value = "";

    this.saveTasks();
    this.render();
    }

    deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
    this.render();
    }

    toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    task.termine = !task.termine;
    this.saveTasks();
    this.render();
    }

    editTask(id) {
    const task = this.tasks.find(t => t.id === id);

    let nouveau = prompt("Modifier :", task.texte);
    if (!nouveau || nouveau.trim() === "") return;

    task.texte = nouveau.trim();

    this.saveTasks();
    this.render();
    }

    filterTasks(type) {
        this.render(type);
    }

    render(filter = "all") {

    let list = document.getElementById("taskList");
    list.innerHTML = "";

    let data = [...this.tasks];

    if (filter === "completed") {
        data = data.filter(t => t.termine);
    }

    if (filter === "active") {
        data = data.filter(t => !t.termine);
    }

    data.forEach((task) => {

        let li = document.createElement("li");
        li.draggable = true;

        li.innerHTML = `
            <span onclick="todoApp.toggleTask(${task.id})"
                class="${task.termine ? 'completed' : ''}">
                ${task.texte}
            </span>

            <small class="priority ${task.priority}">
                ${task.priority}
            </small>

            <div>
                <button onclick="todoApp.editTask(${task.id})">✏️</button>
                <button onclick="todoApp.deleteTask(${task.id})">❌</button>
            </div>
        `;

        list.appendChild(li);
    });

    this.saveTasks();
    this.updateCounter();
}

    saveTasks() {

        if (!this.utilisateur) return;

        this.utilisateur.todos = this.tasks;

        let utilisateurs = JSON.parse(localStorage.getItem("utilisateurs")) || [];

        let index = utilisateurs.findIndex(u => u.email === this.utilisateur.email);

        if (index !== -1) {
            utilisateurs[index] = this.utilisateur;
        }

        localStorage.setItem("utilisateurs", JSON.stringify(utilisateurs));
        localStorage.setItem("utilisateurConnecte", JSON.stringify(this.utilisateur));
    }

    updateCounter() {

        let total = this.tasks.length;
        let remaining = this.tasks.filter(t => !t.termine).length;

        document.getElementById("taskCounter").textContent =
            `${total} tâche(s) • ${remaining} restante(s)`;
    }

    toggleDarkMode() {
        document.body.classList.toggle("dark");
    }

    enableDragAndDrop() {

        let list = document.getElementById("taskList");

        list.addEventListener("dragover", e => {

            e.preventDefault();

            let afterElement = this.getDragAfterElement(e.clientY);
            let dragging = document.querySelector(".dragging");

            if (!dragging) return;

            if (afterElement == null) {
                list.appendChild(dragging);
            } else {
                list.insertBefore(dragging, afterElement);
            }
        });

        list.addEventListener("drop", () => {

             const items = [...list.querySelectorAll("li")];

           this.tasks = items.map(li => {
                const index = [...list.children].indexOf(li);
                return this.tasks[index];
            });

            this.saveTasks();
        });
    }

    getDragAfterElement(y) {

        let elements = [...document.querySelectorAll("#taskList li:not(.dragging)")];

        return elements.reduce((closest, child) => {

            let box = child.getBoundingClientRect();
            let offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            } else {
                return closest;
            }

        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    searchTask(keyword) {

        let result = this.tasks.filter(t =>
            t.texte.toLowerCase().includes(keyword.toLowerCase())
        );

        this.renderCustom(result);
    }

    renderCustom(data) {

        let list = document.getElementById("taskList");
        list.innerHTML = "";

        data.forEach(task => {

            let li = document.createElement("li");

            li.innerHTML = `
                <span onclick="todoApp.toggleTask(${task.id})"
                    class="${task.termine ? 'completed' : ''}">
                    ${task.texte}
                </span>

                <small class="priority ${task.priority}">
                    ${task.priority}
                </small>

                <div>
                    <button onclick="todoApp.editTask(${task.id})">✏️</button>
                    <button onclick="todoApp.deleteTask(${task.id})">❌</button>
                </div>
            `;

            list.appendChild(li);
        });
    }

    sortByPriority() {

        const order = {
            "haute": 1,
            "moyenne": 2,
            "basse": 3
        };

        this.tasks.sort((a, b) =>
            order[a.priority] - order[b.priority]
        );

        this.render();
    }

    clearCompleted() {

        this.tasks = this.tasks.filter(task => !task.termine);

        this.saveTasks();
        this.render();
    }

    getNomAffichage() {
        return this.utilisateur?.nom?.toUpperCase() || "";
    }
}

const todoApp = new TodoApp();