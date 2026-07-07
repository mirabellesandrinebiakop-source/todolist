class TodoApp {

constructor() {

    this.taskInput = document.getElementById("taskInput");
    this.taskList = document.getElementById("taskList");
    this.taskCounter = document.getElementById("taskCounter");

    const saved = localStorage.getItem("utilisateurConnecte");
    this.utilisateur = saved ? JSON.parse(saved) : null;

    this.manager = new TodoManager(this.utilisateur);
    this.updateProfile();

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

        data = data.filter(
            t => t.statut !== "terminee"
        );

    }


    if (filter === "completed") {

        data = data.filter(
            t => t.statut === "terminee"
        );

    }



    this.taskList.innerHTML = "";



    data.forEach(todo => {


        const tr = document.createElement("tr");



        tr.innerHTML = `


            <td>

                <span 
                onclick="todoApp.toggleTask(${todo.id})"
                class="${todo.statut === 'terminee' ? 'completed' : ''}">

                    ${todo.titre}

                </span>

            </td>



            <td>

                <span class="priority ${todo.priorite}">

                    ${todo.priorite}

                </span>

            </td>



            <td>

                ${new Date(todo.dateCreation)
                  .toLocaleDateString("fr-FR")}

            </td>




            <td>

                ${
                    todo.statut === "terminee"
                    ? `<span class="status completed-status">
                        Completed
                       </span>`
                    : `<span class="status pending-status">
                        Pending
                    </span>`
                }


            </td>




            <td>


                <button onclick="todoApp.editTask(${todo.id})">

                    ✏️

                </button>



                <button onclick="todoApp.deleteTask(${todo.id})">

                    ❌

                </button>


            </td>



        `;



        this.taskList.appendChild(tr);



    });



    this.updateCounter();

}

updateCounter() {


    const todos = this.manager.getAll();



    const total = todos.length;



    const completed = todos.filter(
        t => t.statut === "terminee"
    ).length;



    const pending = todos.filter(
        t => t.statut !== "terminee"
    ).length;




const overdue = 0;


    if(this.taskCounter){

        this.taskCounter.textContent =
        `${total} tâches • ${pending} restantes`;

    }


    const totalElement =
    document.getElementById("totalTasks");


    const completedElement =
    document.getElementById("completedTasks");


    const pendingElement =
    document.getElementById("pendingTasks");


    const overdueElement =
    document.getElementById("overdueTasks");




    if(totalElement)
        totalElement.textContent = total;



    if(completedElement)
        completedElement.textContent = completed;



    if(pendingElement)
        pendingElement.textContent = pending;



    if(overdueElement)
        overdueElement.textContent = overdue;

    const completedPercent =
    total === 0
    ? 0
    : Math.round((completed / total) * 100);



    const progress =
    document.getElementById("progressValue");


    const completedText =
    document.getElementById("performanceCompleted");


    const productivity =
    document.getElementById("productivity");



    if(progress){

        progress.style.width =
        completedPercent + "%";

    }



    if(completedText){

        completedText.textContent =
        completedPercent + "%";

    }



    if(productivity){

        productivity.textContent =
        completedPercent + "%";

    }
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

updateProfile(){

    const profile = document.getElementById("profileName");


    if(profile && this.utilisateur){

        profile.textContent =
        this.utilisateur.prenom + " " + this.utilisateur.nom;

    }

}

}