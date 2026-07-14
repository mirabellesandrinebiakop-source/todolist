let utilisateurs = JSON.parse(localStorage.getItem("utilisateurs")) || [];
let utilisateurConnecte = null;

function resetValidation(){

document
.querySelectorAll(".auth-card input")
.forEach(input=>{

input.classList.remove("input-error");
input.classList.remove("input-success");

});

}

function goToAuth() {

    document.getElementById("landingPage").style.display = "none";
    document.getElementById("authPage").style.display = "block";
    document.getElementById("app").style.display = "none";

}

function inscrireUtilisateur() {

    resetValidation();

    const nom = document.getElementById("registerNom").value.trim();

    const prenom = document.getElementById("registerPrenom").value.trim();

    const age = "";

    const email = document.getElementById("registerEmail").value.trim();

    const mdp = document.getElementById("registerPassword").value.trim();

    const confirm = document.getElementById("confirmPassword").value.trim();

    const message = document.getElementById("registerMessage");

    message.textContent = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!nom){

document.getElementById("registerNom")
.classList.add("input-error");

message.textContent="Le nom est obligatoire.";

return;

}

if(!prenom){

document.getElementById("registerPrenom")
.classList.add("input-error");

message.textContent="Le prénom est obligatoire.";

return;

}

if(!email){

document.getElementById("registerEmail")
.classList.add("input-error");

message.textContent="L'email est obligatoire.";

return;

}

if(!mdp){

document.getElementById("registerPassword")
.classList.add("input-error");

message.textContent="Le mot de passe est obligatoire.";

return;

}

if(!confirm){

document.getElementById("confirmPassword")
.classList.add("input-error");

message.textContent="Confirmez votre mot de passe.";

return;

}
    
    if (!emailRegex.test(email)) {

    document.getElementById("registerEmail")
    .classList.add("input-error");

    message.textContent="Adresse email invalide.";

    return;

    }

    if (mdp !== confirm) {

        document.getElementById("confirmPassword")
        .classList.add("input-error");

        message.textContent = "Les mots de passe ne correspondent pas.";

        return;
    }

    if (mdp.length < 8) {

    document.getElementById("registerPassword")
    .classList.add("input-error");

    message.textContent = "Le mot de passe doit contenir au moins 8 caractères.";

    return;

    }

    const existe = utilisateurs.find(u => u.email === email);

    if (existe) {

        message.textContent = "Cet email est déjà utilisé.";

        return;
    }

    const user = new Utilisateur(
        Date.now(),
        nom,
        prenom,
        email,
        mdp
    );

    message.style.color = "#16a34a";
    message.textContent = "Compte créé avec succès.";

    document
    .querySelectorAll("#registerCard input")
    .forEach(input=>{

    input.classList.add("input-success");

    });

utilisateurs.push(user);

localStorage.setItem("utilisateurs", JSON.stringify(utilisateurs));


utilisateurConnecte = user;

localStorage.setItem(
    "utilisateurConnecte",
    JSON.stringify(user)
);


document.getElementById("landingPage").style.display = "none";

document.getElementById("authPage").style.display = "none";

document.getElementById("app").style.display = "block";


window.todoApp = new TodoApp();

}

function connecterUtilisateur() {

    resetValidation();

    utilisateurs = JSON.parse(localStorage.getItem("utilisateurs")) || [];

    const email = document.getElementById("loginEmail").value.trim();
    const mdp = document.getElementById("loginPassword").value.trim();
    const loginMessage = document.getElementById("loginMessage");

    loginMessage.textContent = "";

    const user = utilisateurs.find(u =>
        u.email === email && u.motDePasse === mdp
    );

    if (!user) {

    document.getElementById("loginEmail")
    .classList.add("input-error");

    document.getElementById("loginPassword")
    .classList.add("input-error");

    loginMessage.textContent = "Email ou mot de passe incorrect.";

    return;
    }

    utilisateurConnecte = user;

    localStorage.setItem("utilisateurConnecte", JSON.stringify(user));

    document.getElementById("landingPage").style.display = "none";
    document.getElementById("authPage").style.display = "none";
    document.getElementById("app").style.display = "block";
    document
    .querySelectorAll(".auth-card input")
    .forEach(input=>{

    input.classList.add("input-success");

    });

    window.todoApp = new TodoApp();

}

function deconnecterUtilisateur() {

    localStorage.removeItem("utilisateurConnecte");

    utilisateurConnecte = null;

    document.getElementById("app").style.display = "none";
    document.getElementById("landingPage").style.display = "block";
    document.getElementById("authPage").style.display = "none";

}

window.addEventListener("load", () => {

    const saved = localStorage.getItem("utilisateurConnecte");

    if (saved) {

        document.getElementById("landingPage").style.display = "none";
        document.getElementById("authPage").style.display = "none";
        document.getElementById("app").style.display = "block";

        window.todoApp = new TodoApp();

    }

});


function showRegister(){

    document.querySelector(".auth-card").style.display = "none";

    document.getElementById("registerCard").style.display = "block";

}

function showLogin(){

    document.querySelector(".auth-card").style.display = "block";

    document.getElementById("registerCard").style.display = "none";

}

function showDemo(){

    showModal(
    "Démonstration",
    "La démonstration interactive sera disponible dans une prochaine version de TodoApp Pro."
    );

}

function goHome(){

    document.getElementById("landingPage").style.display = "block";

    document.getElementById("authPage").style.display = "none";

    document.getElementById("app").style.display = "none";

}

function googleLogin(){

    showModal(
    "Google",
    "La connexion avec Google sera disponible prochainement."
    );

}

function githubLogin(){

    showModal(
    "GitHub",
    "La connexion avec GitHub sera disponible prochainement."
    );

}

function forgotPassword(){

let email = prompt(
"Entrez votre email pour récupérer votre mot de passe"
);


if(email){

showModal(
"Récupération",
"Un lien de récupération a été envoyé à : " + email
);

}

}

function showSection(section, element){

    document.querySelectorAll(".sidebar-menu a")
    .forEach(link => link.classList.remove("active"));

    element.classList.add("active");

    const title = document.getElementById("pageTitle");

    switch(section){

        case "dashboard":

            title.textContent = "Dashboard";
            break;

        case "projects":

            title.textContent = "Projects";

            showModal(
                "Projects",
                "Le module Projects sera disponible dans une prochaine version."
            );

            break;

        case "tasks":

            title.textContent = "Tasks";
            break;

        case "messages":

            title.textContent = "Messages";

            showModal(
                "Messages",
                "Vous n'avez aucun nouveau message."
            );

            break;

        case "settings":

            title.textContent = "Settings";

            showModal(
                "Settings",
                "Les paramètres seront bientôt disponibles."
            );

            break;

        case "help":

            title.textContent = "Help";

            showModal(
                "Centre d'aide",
                "Bienvenue dans le centre d'aide de TodoApp Pro."
            );

            break;

    }

}

function showModal(title,message){

document.getElementById("modalTitle").textContent=title;

document.getElementById("modalMessage").textContent=message;

document.getElementById("appModal").classList.add("show");

}

function closeModal(){

document.getElementById("appModal").classList.remove("show");

}
