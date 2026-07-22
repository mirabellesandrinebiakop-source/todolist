class TodoApp {

constructor() {

    this.taskInput = document.getElementById("taskInput");
    this.taskList = document.getElementById("taskList");
    this.taskCounter = document.getElementById("taskCounter");

    const saved = localStorage.getItem("utilisateurConnecte");

    this.utilisateur = saved ? JSON.parse(saved) : null;

    if (!this.utilisateur) {

        console.error("Aucun utilisateur connecté.");

        return;

    }

    this.editingTaskId = null;

    this.manager = new TodoManager(this.utilisateur);

    this.render();
    this.updateCounter();

}

addTask() {

    const text = this.taskInput.value.trim();

    if (!text) {
    this.showNotification("⚠️ Veuillez saisir une tâche.", "warning");
    return;
    }

    const finalPriority = document.getElementById("prioritySelect").value;
    const deadline = document.getElementById("deadlineInput").value;

    const todo = new Todo(
    Date.now(),
    text,
    "",
    "a faire",
    finalPriority,
    new Date(),
    null,
    deadline
    );

    this.manager.add(todo);

    this.taskInput.value = "";

    document.getElementById("prioritySelect").value = "moyenne";
    document.getElementById("deadlineInput").value = "";

    this.render();

    this.showNotification("✅ Tâche ajoutée avec succès !");
}

editTask(id){

    const todo = this.manager.findById(id);

    if(!todo){
        return;
    }


    this.editingTaskId = id;


    document.getElementById("modalTitle").textContent =
    "Modifier la tâche";


    document.getElementById("modalSubmitBtn").textContent =
    "Enregistrer";


    document.getElementById("modalTaskTitle").value =
    todo.titre;


    document.getElementById("modalTaskDescription").value =
    todo.description || "";


    document.getElementById("modalPriority").value =
    todo.priorite;


    document.getElementById("modalDeadline").value =
    todo.dateFin || "";


    document.getElementById("taskModal").style.display =
    "flex";

}

deleteTask(id) {

    this.manager.delete(id);

    this.render();

    this.showNotification("🗑️ Tâche supprimée.", "error");

}

toggleTask(id) {

    const todo = this.manager.findById(id);

    if (!todo) return;


    this.manager.toggle(id);


    this.render();


    if(todo.statut === "terminee"){

        this.showNotification(
            "🎉 Tâche terminée !"
        );

    }else{

        this.showNotification(
            "↩️ Tâche remise en cours."
        );

    }

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

        let deadlineWarning = "";

if (todo.dateLimite) {

    const aujourdHui = new Date();

    const limite = new Date(todo.dateLimite);

    const difference =
        (limite - aujourdHui) / (1000 * 60 * 60 * 24);

    if (difference <= 1 && todo.statut !== "terminee") {

        deadlineWarning =
            `<span style="
                color:red;
                font-weight:bold;
            ">
            🔴 Deadline proche
            </span>`;

    }

}
        const tr = document.createElement("tr");



        tr.innerHTML = `
<td class="task-cell">
    <div class="task-info">
        <div class="task-icon">📝</div>

        <div>
            <strong 
            onclick="todoApp.toggleTask(${todo.id})"
            class="${todo.statut === 'terminee' ? 'completed' : ''}">
            ${todo.titre}
            </strong>
            <br>

            <small>
                ${todo.description || "Aucune description"}
            </small>

            <br>

            ${deadlineWarning}
        </div>
    </div>
</td>

<td>
    <span class="priority ${todo.priorite}">
        ${todo.priorite}
    </span>
</td>

<td>
    ${
        todo.statut === "terminee"
        ? `<span class="status completed-status">🟢 Completed</span>`
        : `<span class="status pending-status">🟡 Pending</span>`
    }
</td>

<td>
    ${new Date(todo.dateCreation).toLocaleDateString("fr-FR")}
</td>

<td>
    ${
        todo.dateLimite
        ? new Date(todo.dateLimite).toLocaleDateString("fr-FR")
        : "-"
    }
</td>

<td class="action-buttons">

    <button onclick="todoApp.moveUp(${todo.id})">
        ⬆️
    </button>

    <button onclick="todoApp.moveDown(${todo.id})">
        ⬇️
    </button>

    <button onclick="todoApp.editTask(${todo.id})">
        ✏️
    </button>

    <button onclick="todoApp.deleteTask(${todo.id})">
        🗑️
    </button>

</td>
`;



        this.taskList.appendChild(tr);



    });



    this.updateCounter();

}

updateCounter() {


    const total = this.manager.countTotal();

    const completed = this.manager.countCompleted();

    const pending = this.manager.countPending();



    const overdue = this.manager.countOverdue();
    const highPriority = this.manager.countHighPriority();
    
    const overdueElement =
    document.getElementById("overdueTasks");

    if(overdueElement){

    overdueElement.textContent = overdue;

    }


    const totalElement =
    document.getElementById("totalTasks");


    const completedElement =
    document.getElementById("completedTasks");


    const pendingElement =
    document.getElementById("pendingTasks");


    const highPriorityElement =
    document.getElementById("highPriorityTasks");

    if(highPriorityElement){

    highPriorityElement.textContent = highPriority;

    }


    if(totalElement)
        totalElement.textContent = total;



    if(completedElement)
        completedElement.textContent = completed;



    if(pendingElement)
        pendingElement.textContent = pending;

    const summaryTotal = document.getElementById("summaryTotal");
    const summaryCompleted = document.getElementById("summaryCompleted");
    const summaryPending = document.getElementById("summaryPending");

    if(summaryTotal){
        summaryTotal.textContent = total;
    }

    if(summaryCompleted){
        summaryCompleted.textContent = completed;
    }

    if(summaryPending){
        summaryPending.textContent = pending;
    }

    if(overdueElement)
        overdueElement.textContent = overdue;

    const completedPercent =
    total === 0
    ? 0
    : Math.round((completed / total) * 100);

    const perfTotal =
    document.getElementById("perfTotal");

    const perfCompleted =
    document.getElementById("perfCompleted");

    const perfPercent =
    document.getElementById("perfPercent");

    const progress =
    document.getElementById("progressValue");

    if(perfTotal){
        perfTotal.textContent = total;
    }

    if(perfCompleted){
        perfCompleted.textContent = completed;
    }

    if(perfPercent){
        perfPercent.textContent = completedPercent + "%";
    }

    if(progress){
        progress.style.width = completedPercent + "%";
    } 
    
    const circle = document.getElementById("progressCircle");
    const circleText = document.getElementById("circlePercent");

if(circle){

    const rayon = 55;

    const circonference = 2 * Math.PI * rayon;

    const offset =
        circonference -
        (completedPercent / 100) * circonference;

    circle.style.strokeDasharray = circonference;

    circle.style.strokeDashoffset = offset;

}

    if(circleText){

        circleText.textContent = completedPercent + "%";

    }
    const date = new Date();

    const options = {

    weekday:"long",

    day:"numeric",

    month:"long",

    year:"numeric"

    };

    const today = document.getElementById("todayDate");

    if(today){

    today.textContent =
        date.toLocaleDateString("fr-FR", options);

    }
    
}

clearCompleted() {
    this.manager.clearCompleted();
    this.render();
}

sortByPriority() {

    this.manager.sortByPriority();

    this.render();

}
searchTask(value) {

    const data = this.manager.search(value);

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
                ${new Date(todo.dateCreation).toLocaleDateString("fr-FR")}
            </td>

            <td>
                ${
                    todo.statut === "terminee"
                    ? `<span class="status completed-status">Completed</span>`
                    : `<span class="status pending-status">Pending</span>`
                }
            </td>

            <td>
                <button onclick="todoApp.editTask(${todo.id})">✏️</button>
                <button onclick="todoApp.deleteTask(${todo.id})">❌</button>
            </td>

        `;

        this.taskList.appendChild(tr);

    });

}

toggleDarkMode() {
    document.body.classList.toggle("dark");
}

moveUp(id) {

    this.manager.moveUp(id);

    this.render();

}

moveDown(id) {

    this.manager.moveDown(id);

    this.render();

}

updateProfile(){

    const profile = document.getElementById("profileName");


    if(profile && this.utilisateur){

        profile.textContent =
        this.utilisateur.prenom + " " + this.utilisateur.nom;

    }

}

showNotification(message, type = "success") {

    const notification = document.getElementById("notification");

    if (!notification) return;

    notification.textContent = message;

    notification.className = "";

    notification.classList.add(type);

    notification.classList.add("show");

    setTimeout(() => {

        notification.classList.remove("show");

    }, 3000);

}

addTaskFromModal(){

    const titre =
    document.getElementById("modalTaskTitle").value;

    const description =
    document.getElementById("modalTaskDescription").value;

    const priorite =
    document.getElementById("modalPriority").value;

    const deadline =
    document.getElementById("modalDeadline").value;


    if(!titre.trim()){

        this.showNotification(
            "Veuillez entrer un titre.",
            "warning"
        );

        return;

    }

    if(this.editingTaskId){

        this.manager.update(
            this.editingTaskId,
            {
                titre:titre.trim(),
                description:description,
                priorite:priorite,
                dateFin:deadline
            }
        );


        this.showNotification(
            "✏️ Tâche modifiée avec succès !"
        );


    }else {


        const todo = new Todo(
            Date.now(),
            titre.trim(),
            description,
            "a faire",
            priorite,
            new Date(),
            null,
            deadline
        );


        this.manager.add(todo);


        this.showNotification(
            "✅ Tâche créée avec succès !"
        );

    }


    this.manager.save();


    this.render();


    this.updateCounter();


    closeTaskModal();


    document.getElementById("modalTaskTitle").value="";
    
    document.getElementById("modalTaskDescription").value="";
    
    document.getElementById("modalDeadline").value="";

    this.editingTaskId = null;


    document.getElementById("modalTitle").textContent =
    "Créer une nouvelle tâche";


    document.getElementById("modalSubmitBtn").textContent =
    "Créer la tâche";

}

openInfoModal(type){

    const modal =
    document.getElementById("infoModal");

    const title =
    document.getElementById("infoTitle");

    const text =
    document.getElementById("infoText");


    if(type === "privacy"){

        title.textContent = "Privacy";

        text.textContent =
        "Vos données restent privées et sont stockées localement dans votre navigateur.";

    }


    if(type === "terms"){

        title.textContent = "Terms";

        text.textContent =
        "En utilisant TodoApp Pro, vous acceptez les conditions d'utilisation de l'application.";

    }


    if(type === "contact"){

        title.textContent = "Contact";

        text.textContent =
        "Pour toute question, contactez l'équipe TodoApp Pro.";

    }


    modal.classList.add("show");

}



closeInfoModal(){

    document
    .getElementById("infoModal")
    .classList.remove("show");

}

}

const todoApp = new TodoApp();


function openInfoModal(type){

    todoApp.openInfoModal(type);

}


function closeInfoModal(){

    todoApp.closeInfoModal();

}