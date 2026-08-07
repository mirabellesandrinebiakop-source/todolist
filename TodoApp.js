class TodoApp {

    constructor() {

        this.taskInput = document.getElementById("taskInput");
        this.taskList = document.getElementById("taskList");
        this.taskCounter = document.getElementById("taskCounter");

        this.globalSearch =
        document.getElementById("globalSearch");


        if(this.globalSearch){

        this.globalSearch.addEventListener("input", (e)=>{

        const value = e.target.value.trim();


        if(value.length < 2){

            const container =
            document.getElementById("globalResults");

            if(container){
                container.innerHTML = "";
            }

            return;
        }


        this.searchGlobal(value);

    });

}


    const saved = localStorage.getItem("utilisateurConnecte");

    this.utilisateur = saved ? JSON.parse(saved) : null;


    if (!this.utilisateur) {

        document.getElementById("landingPage").style.display = "block";

        document.getElementById("authPage").style.display = "none";

        document.getElementById("app").style.display = "none";

        return;

    }


    this.editingTaskId = null;

    this.deletingTaskId = null;

    this.manager = new TodoManager(this.utilisateur);

    this.projects = [];

    this.init();

}

async init() {

    await this.manager.chargerDepuisServeur();

    await this.chargerProjets();

    this.initSettings();

    this.loadDarkMode();

    this.loadLanguage();

    this.loadNotificationPreference();

    this.loadDisplayMode();

    this.loadSettings();

    this.initDragAndDrop();

    this.render();

    this.updateCounter();

    if(this.globalSearch){

        this.globalSearch.addEventListener("input", () => {

            this.render();

        });

    }

}

async addTask() {

    const text = this.taskInput.value.trim();

    if (!text) {
    this.showNotification("⚠️ Veuillez saisir une tâche.", "warning");
    return;
    }

    const finalPriority = document.getElementById("prioritySelect").value;
    const deadline = document.getElementById("deadlineInput").value;
    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateurConnecte")
    );

    if (!utilisateur) {

        this.showNotification(
            "Veuillez vous connecter.",
            "error"
        );

        return;

    }

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

    try {

        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/todos", {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({

                titre: text,
                description: "",
                priorite: finalPriority,
                dateFin: deadline

            })

        });

        const data = await response.json();

        if (!response.ok) {

            this.showNotification(data.message, "error");

            return;

        }

        this.taskInput.value = "";

        document.getElementById("prioritySelect").value = "moyenne";

        document.getElementById("deadlineInput").value = "";

        await this.manager.chargerDepuisServeur();

        this.render();

        this.updateCounter();

        this.showNotification("✅ Tâche ajoutée avec succès !");

    } catch (error) {

        console.error(error);

        this.showNotification(
            "Impossible de contacter le serveur.",
            "error"
        );

    }
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

async deleteTask(id) {

    if (!confirm("Voulez-vous vraiment supprimer cette tâche ?")) {

        return;

    }

    try {

        const token = localStorage.getItem("token");
        const response = await fetch(

            `http://localhost:3000/todos/${id}`,

            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }

        );

        const data = await response.json();

        if (!response.ok) {

            this.showNotification(data.message, "error");

            return;

        }

        await this.manager.chargerDepuisServeur();

        this.render();

        this.updateCounter();

        this.showNotification(
            "🗑️ Tâche supprimée avec succès."
        );

    } catch (error) {

        console.error(error);

        this.showNotification(
            "Impossible de supprimer la tâche.",
            "error"
        );

    }

}

async toggleTask(id) {

    console.log("this =", this);
    console.log("this.manager =", this.manager);

    const todo = this.manager.findById(id);

    console.log("ID reçu :", id);
    console.log("Mes tâches :", this.manager.getAll());
    console.log("Tâche trouvée :", todo);

    if (!todo) return;
    
    if (!todo) return;

    console.log("Tâche sélectionnée :", todo);

    const nouveauStatut =
    todo.statut === "terminee"
    ? "a faire"
    : "terminee";


    try {

        const token = localStorage.getItem("token");
        const response = await fetch(
            `http://localhost:3000/todos/${id}`,
            {

                method:"PUT",

                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                },

                body:JSON.stringify({

                    titre: todo.titre,

                    description: todo.description,

                    priorite: todo.priorite,

                    statut: nouveauStatut,

                    dateFin: todo.dateFin

                })

            }
        );


        const data = await response.json();


        if(!response.ok){

            this.showNotification(
                data.message,
                "error"
            );

            return;

        }


        await this.manager.chargerDepuisServeur();


        this.render();


        if(nouveauStatut === "terminee"){

            this.showNotification(
                "🎉 Tâche terminée !"
            );

        }else{

            this.showNotification(
                "↩️ Tâche remise en cours."
            );

        }


    } catch(error){

        console.error(error);

        this.showNotification(
            "Impossible de modifier le statut.",
            "error"
        );

    }

}

filterTasks(type) {


    this.render(type);


    document
    .querySelectorAll(".filters button")
    .forEach(btn => {

        btn.classList.remove("active-filter");

    });


    const bouton =
    document.getElementById(
        "filter" +
        type.charAt(0).toUpperCase() +
        type.slice(1)
    );


    if(bouton){

        bouton.classList.add(
            "active-filter"
        );

    }


}

render(filter = "all") {

    const all = this.manager.getAll();

    let data = [...all];

    const recherche =
    this.globalSearch.value.trim().toLowerCase();

if (recherche) {

    data = data.filter(todo => {

        return (
            todo.titre.toLowerCase().includes(recherche) ||

            (todo.description || "")
                .toLowerCase()
                .includes(recherche)

        );

    });

}


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

if (todo.dateFin && todo.statut !== "terminee") {

    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);

    const limite = new Date(todo.dateFin.substring(0,10));
    limite.setHours(0, 0, 0, 0);

    const difference =
        Math.ceil((limite - aujourdHui) / (1000 * 60 * 60 * 24));

    if (difference < 0) {

        deadlineWarning = `
            <span style="color:red;font-weight:bold;">
                🔴 En retard
            </span>
        `;

    } else if (difference <= 3) {

        deadlineWarning = `
            <span style="color:orange;font-weight:bold;">
                🟠 Deadline proche
            </span>
        `;

    }

}

        const tr = document.createElement("tr");

        tr.draggable = true;

        tr.dataset.id = todo.id;


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
        todo.dateFin
        ? todo.dateFin.substring(0,10).split("-").reverse().join("/")
        : "-"
    }
</td>

<td class="action-buttons">

    <button onclick="todoApp.editTask(${todo.id})">
        ✏️
    </button>

    <button onclick="todoApp.openDeleteModal(${todo.id})">
        🗑️
    </button>

</td>
`;

tr.addEventListener("dragstart", (e) => {

    e.dataTransfer.setData("text/plain", todo.id);

    tr.classList.add("dragging");

});


tr.addEventListener("dragend", () => {

    tr.classList.remove("dragging");

});

        this.taskList.appendChild(tr);



    });



    this.updateCounter();

}

initDragAndDrop() {

    this.taskList.addEventListener("dragover", (e) => {

        e.preventDefault();

    });

    this.taskList.addEventListener("drop", (e) => {

        e.preventDefault();

        const draggedId = Number(
            e.dataTransfer.getData("text/plain")
        );

        const targetRow = e.target.closest("tr");

        if (!targetRow) return;

        const targetId = Number(targetRow.dataset.id);

        if (draggedId === targetId) return;

        this.manager.moveTask(draggedId, targetId);

        this.render();

    });

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

async clearCompleted() {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:3000/todos/completed/all",
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        if(!response.ok){

            this.showNotification(
                data.message,
                "error"
            );

            return;

        }


        await this.manager.chargerDepuisServeur();

        this.render();

        this.updateCounter();


        this.showNotification(
            `🗑️ ${data.deleted} tâche(s) terminée(s) supprimée(s).`
        );


    } catch(error){

        console.error(error);

        this.showNotification(
            "Impossible de supprimer les tâches terminées.",
            "error"
        );

    }

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
                <button onclick="todoApp.openDeleteModal(${todo.id})">❌</button>
            </td>

        `;

        this.taskList.appendChild(tr);

    });

}

async searchGlobal(value) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `http://localhost:3000/search?query=${encodeURIComponent(value)}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const results = await response.json();

    this.displayGlobalResults(results);

    return results;

}

displayGlobalResults(results) {

    const container = document.getElementById("globalResults");

    if (!container) return;


    container.innerHTML = "";


    if (
        results.tasks.length === 0 &&
        results.projects.length === 0 &&
        results.attachments.length === 0
    ) {

        container.innerHTML = `
            <p>Aucun résultat trouvé</p>
        `;

        return;
    }



    if (results.tasks.length > 0) {

        container.innerHTML += `
            <h4>📋 Tasks</h4>
        `;

        results.tasks.forEach(task => {

            container.innerHTML += `
                <div class="result-item">
                    ${task.titre}
                </div>
            `;

        });

    }



    if (results.projects.length > 0) {

        container.innerHTML += `
            <h4>📁 Projects</h4>
        `;

        results.projects.forEach(project => {

            container.innerHTML += `
                <div class="result-item">
                    ${project.nom}
                </div>
            `;

        });

    }



    if (results.attachments.length > 0) {

        container.innerHTML += `
            <h4>📎 Attachments</h4>
        `;

        results.attachments.forEach(file => {

            container.innerHTML += `
                <div class="result-item">
                    ${file.nom}
                </div>
            `;

        });

    }

}

toggleDarkMode() {

    document.body.classList.toggle("dark");

    const dark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "darkMode",
        dark
    );

    const icon =
        document.getElementById("darkModeIcon");

    if(icon){

        icon.className = dark
            ? "fa-solid fa-sun"
            : "fa-solid fa-moon";

    }

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


    const preference =
        localStorage.getItem("notifications");


    if(preference === "disabled"){

        return;

    }



    const notification =
        document.getElementById("notification");


    if (!notification) return;


    notification.textContent = message;


    notification.className = "";


    notification.classList.add(type);


    notification.classList.add("show");


    setTimeout(() => {

        notification.classList.remove("show");

    }, 3000);


}

async addTaskFromModal(){

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

    if (this.editingTaskId) {

    try {

        const token = localStorage.getItem("token");
        const ancienneTache = this.manager.findById(this.editingTaskId);
        const response = await fetch(
            `http://localhost:3000/todos/${this.editingTaskId}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({

                    titre: titre.trim(),
                    description: description,
                    priorite: priorite,
                    statut: ancienneTache 
                        ? ancienneTache.statut 
                        : "a faire",
                    dateFin: deadline

                })

            }
        );

        const data = await response.json();

        if (!response.ok) {

            this.showNotification(data.message, "error");

            return;

        }

        await this.manager.chargerDepuisServeur();

        this.showNotification(
            "✏️ Tâche modifiée avec succès !"
        );

    } catch (error) {

        console.error(error);

        this.showNotification(
            "Impossible de modifier la tâche.",
            "error"
        );

        return;

    }

} else {


        const utilisateur = JSON.parse(
            localStorage.getItem("utilisateurConnecte")
        );

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:3000/todos",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        utilisateur_id: utilisateur.id,
                        titre: titre.trim(),
                        description: description,
                        priorite: priorite,
                        dateFin: deadline

                    })

            }
        );

        const data = await response.json();

        if (!response.ok) {

            this.showNotification(data.message, "error");

            return;

        }

        await this.manager.chargerDepuisServeur();

        this.showNotification(
            "✅ Tâche créée avec succès !"
        );

    } catch (error) {

        console.error(error);

        this.showNotification(
            "Impossible de contacter le serveur.",
            "error"
        );

        return;

    }

    }



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

async openInfoModal(type){

    const modal =
    document.getElementById("infoModal");

    const title =
    document.getElementById("infoTitle");

    const text =
    document.getElementById("infoText");


    try {


        const response = await fetch(
            `http://localhost:3000/informations/${type}`
        );


        const data = await response.json();


        if(!response.ok){

            throw new Error(data.message);

        }


        title.textContent =
        data.titre;


        text.textContent =
        data.contenu;


        modal.classList.add("show");


    }
    catch(error){


        console.error(
            "Erreur chargement information :",
            error
        );


        title.textContent =
        "Erreur";


        text.textContent =
        "Impossible de charger les informations.";


        modal.classList.add("show");

    }

}


closeInfoModal(){

    document
    .getElementById("infoModal")
    .classList.remove("show");

}

openDeleteModal(id) {

    this.deletingTaskId = id;

    document.getElementById("deleteModal").style.display = "flex";

}


closeDeleteModal() {

    this.deletingTaskId = null;

    document.getElementById("deleteModal").style.display = "none";

}


async confirmDeleteTask() {

    if (!this.deletingTaskId) {

        return;

    }


    try {

        const token = localStorage.getItem("token");

        const response = await fetch(

            `http://localhost:3000/todos/${this.deletingTaskId}`,

            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }

        );


        const data = await response.json();


        if (!response.ok) {

            this.showNotification(
                data.message,
                "error"
            );

            return;

        }


        await this.manager.chargerDepuisServeur();


        this.render();


        this.updateCounter();


        this.showNotification(
            "🗑️ Tâche supprimée avec succès."
        );


        this.closeDeleteModal();

        this.deletingTaskId = null;

    } catch(error) {

        console.error(error);


        this.showNotification(
            "Impossible de supprimer la tâche.",
            "error"
        );

    }

}

openLogoutModal() {

    document.getElementById("logoutModal").style.display = "flex";

}


closeLogoutModal() {

    document.getElementById("logoutModal").style.display = "none";

}


confirmLogout() {

    localStorage.removeItem("utilisateurConnecte");

    localStorage.removeItem("token");

    sessionStorage.clear();

    this.utilisateur = null;

    this.editingTaskId = null;

    this.deletingTaskId = null;

    this.taskList.innerHTML = "";

    const profile = document.getElementById("profileName");

    if(profile){

        profile.textContent = "";

    }

    this.closeLogoutModal();

    document.getElementById("app").style.display = "none";

    document.getElementById("authPage").style.display = "none";

    document.getElementById("landingPage").style.display = "block";

    this.showNotification(
        "👋 Vous êtes déconnecté avec succès."
    );

}

async chargerProjets() {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:3000/projects",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {

            throw new Error("Erreur");

        }

        this.projects = await response.json();
        this.displayProjects();
        this.updateProjectsStats();

    } catch (error) {

        console.error(error);

        this.projects = [];

    }

}

loadSettings() {

    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateurConnecte")
    );

    if (!utilisateur) {
        console.log("Aucun utilisateur connecté");
        return;
    }


    document.getElementById("settingsNom").value =
        utilisateur.nom || "";


    document.getElementById("settingsPrenom").value =
        utilisateur.prenom || "";


    document.getElementById("settingsEmail").value =
        utilisateur.email || "";


    document.getElementById("settingsPassword").value = "";

}

renderProjects() {

    const container =
    document.getElementById("projectsList");

    if (!container) return;

    container.innerHTML = "";

    this.projects.forEach(project => {

        const card = document.createElement("div");

        card.className = "project-card";

        card.style.borderLeftColor =
        project.couleur;

        card.innerHTML = `

            <h3>${project.nom}</h3>

            <p>
                ${
                    project.description ||
                    "Aucune description"
                }
            </p>

            <br>

            <button
                onclick="todoApp.editProject(${project.id})">
                ✏️ Modifier
            </button>

            <button
                onclick="todoApp.deleteProject(${project.id})">
                🗑️ Supprimer
            </button>

        `;

        container.appendChild(card);

    });

}

displayProjects(){

    const container =
    document.getElementById("projectsList");


    if(!container) return;


    container.innerHTML = "";


    if(this.projects.length === 0){

        container.innerHTML = `
            <p>Aucun projet trouvé.</p>
        `;

        return;

    }


    this.projects.forEach(project => {


        container.innerHTML += `

            <div class="project-card">

                <h3>
                    📁 ${project.nom}
                </h3>


                <p>
                    ${project.description || "Aucune description"}
                </p>


            </div>

        `;


    });


}

updateProjectsStats() {

    const totalProjects =
        this.projects.length;

    document.getElementById("totalProjects").textContent =
        totalProjects;

}

initSettings() {

    const form = document.getElementById("settingsForm");

    if (!form) return;

    this.loadSettings();

    if (!form.dataset.initialized) {

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        this.updateSettings();

    });

    form.dataset.initialized = "true";
}

}

async updateSettings() {

    try {

        const utilisateur = JSON.parse(
            localStorage.getItem("utilisateurConnecte")
        );

        console.log("Utilisateur dans updateSettings :", utilisateur);

        const token = localStorage.getItem("token");

        console.log({
            nom: document.getElementById("settingsNom").value,
            prenom: document.getElementById("settingsPrenom").value,
            email: document.getElementById("settingsEmail").value,
            motDePasse: document.getElementById("settingsPassword").value
        });

        const response = await fetch(

            `http://localhost:3000/users/${utilisateur.id}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization": `Bearer ${token}`

                },

                body: JSON.stringify({

                    nom: document.getElementById("settingsNom").value,

                    prenom: document.getElementById("settingsPrenom").value,

                    email: document.getElementById("settingsEmail").value,

                    motDePasse: document.getElementById("settingsPassword").value

                })

            }

        );

        const data = await response.json();

        console.log("Réponse backend :", data);
        console.log("Status :", response.status);

        if (!response.ok) {

            this.showNotification(
                data.message,
                "error"
            );

            return;

        }

        const utilisateurMisAJour = {
            ...utilisateur,
            nom: document.getElementById("settingsNom").value,
            prenom: document.getElementById("settingsPrenom").value,
            email: document.getElementById("settingsEmail").value
        };

        localStorage.setItem(
            "utilisateurConnecte",
            JSON.stringify(utilisateurMisAJour)
        );

        this.showNotification(
            data.message,
            "success"
        );

    } catch (error) {

        console.error(error);

        this.showNotification(
            "Erreur lors de la mise à jour du profil.",
            "error"
        );

    }

}

loadDarkMode() {

    const dark =
        localStorage.getItem("darkMode") === "true";

    if(dark){

        document.body.classList.add("dark");

        const icon =
            document.getElementById("darkModeIcon");

        if(icon){

            icon.className = "fa-solid fa-sun";

        }

    }

}

initPreferences(){

    const darkBtn =
    document.getElementById("settingsDarkBtn");


    const language =
    document.getElementById("languageSelect");


    const notification =
    document.getElementById("notificationSelect");


    const display =
    document.getElementById("displayMode");

    const preferences =
    JSON.parse(
        localStorage.getItem("preferences")
    ) || {};



    if(language){

        language.value =
        preferences.language || "fr";

    }



    if(notification){

        notification.value =
        preferences.notifications || "enabled";

    }



    if(display){

        display.value =
        preferences.display || "normal";

    }



    if(darkBtn){

        const dark =
        document.body.classList.contains("dark");


        darkBtn.textContent =
        dark ? "Désactiver" : "Activer";


        darkBtn.onclick = () => {


            this.toggleDarkMode();


            const actif =
            document.body.classList.contains("dark");


            darkBtn.textContent =
            actif ? "Désactiver" : "Activer";


            this.savePreferences();


        };

    }



    if(language){

        language.addEventListener(
            "change",
            ()=>{

                this.savePreferences();

            }
        );

    }



    if(notification){

        notification.addEventListener(
            "change",
            ()=>{

                this.savePreferences();

            }
        );

    }



    if(display){

        display.addEventListener(
            "change",
            ()=>{

                this.savePreferences();

            }
        );

    }

}

saveLanguage(){

    const language =
        document.getElementById("languageSelect").value;


    localStorage.setItem(
        "language",
        language
    );


    this.showNotification(
        "Langue enregistrée",
        "success"
    );

}

loadLanguage(){

    const language =
        localStorage.getItem("language") || "fr";


    const select =
        document.getElementById("languageSelect");


    if(select){

        select.value = language;

    }

}

saveNotificationPreference(){

    const value =
        document.getElementById("notificationSelect").value;


    localStorage.setItem(
        "notifications",
        value
    );


    this.showNotification(
        "Préférence enregistrée",
        "success"
    );

}

loadNotificationPreference(){

    const value =
        localStorage.getItem("notifications") || "enabled";


    const select =
        document.getElementById("notificationSelect");


    if(select){

        select.value = value;

    }

}

saveDisplayMode(){

    const mode =
        document.getElementById("displayMode").value;


    localStorage.setItem(
        "displayMode",
        mode
    );

    console.log("Mode affichage enregistré :", mode);

    this.applyDisplayMode();

    this.showNotification(
        "Mode d'affichage enregistré",
        "success"
    );


}

loadDisplayMode(){

    const mode =
        localStorage.getItem("displayMode") || "normal";


    const select =
        document.getElementById("displayMode");


    if(select){

        select.value = mode;

    }

    console.log("Mode chargé :", mode);

    this.applyDisplayMode();

}



applyDisplayMode(){

    const mode =
        localStorage.getItem("displayMode");


    if(mode === "compact"){

        document.body.classList.add("compact");

    }else{

        document.body.classList.remove("compact");

    }

}

savePreferences(){

    this.saveLanguage();

    this.saveNotificationPreference();

    this.saveDisplayMode();

    this.showNotification(
        "Préférences enregistrées",
        "success"
    );

}

}

const todoApp = new TodoApp();


function openInfoModal(type){

    todoApp.openInfoModal(type);

}


function closeInfoModal(){

    todoApp.closeInfoModal();

}

function openProjectModal(){

    document
    .getElementById("projectModal")
    .classList.add("show");

}


function closeProjectModal(){

    document
    .getElementById("projectModal")
    .classList.remove("show");

}

async function saveProject(){

    const nom =
    document.getElementById("projectName").value;


    const description =
    document.getElementById("projectDescription").value;


    const couleur =
    document.getElementById("projectColor").value;


    if(!nom.trim()){

        todoApp.showNotification(
            "Le nom du projet est obligatoire."
        );

        return;

    }


    try {


        const token =
        localStorage.getItem("token");


        const response = await fetch(
            "http://localhost:3000/projects",
            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json",

                    "Authorization":
                    `Bearer ${token}`

                },


                body:JSON.stringify({

                    nom: nom,

                    description: description,

                    couleur: couleur

                })

            }
        );


        const data =
        await response.json();


        if(!response.ok){

            todoApp.showNotification(data.message);

            return;

        }


        todoApp.showNotification(
            "📁 Projet créé avec succès !"
        );


        closeProjectModal();


        await todoApp.chargerProjets();



        document.getElementById("projectName").value="";

        document.getElementById("projectDescription").value="";


    }
    catch(error){

        console.error(error);

        todoApp.showNotification("Erreur serveur.");

    }

}