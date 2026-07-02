let utilisateurs = JSON.parse(localStorage.getItem("utilisateurs")) || [];
let utilisateurConnecte = null;

function goToAuth() {

    document.getElementById("landingPage").style.display = "none";
    document.getElementById("authPage").style.display = "block";
    document.getElementById("app").style.display = "none";

}

function inscrireUtilisateur() {

    const nom = document.getElementById("registerNom").value.trim();
    const prenom = document.getElementById("registerPrenom").value.trim();
    const age = document.getElementById("registerAge").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const mdp = document.getElementById("registerPassword").value.trim();

    if (!nom || !prenom || !age || !email || !mdp) {
        alert("Tous les champs sont obligatoires.");
        return;
    }

    const existe = utilisateurs.find(u => u.email === email);

    if (existe) {
        alert("Cet email est déjà utilisé.");
        return;
    }

    const user = new Utilisateur(
        Date.now(),
        nom,
        prenom,
        age,
        email,
        mdp
    );

    utilisateurs.push(user);

    localStorage.setItem("utilisateurs", JSON.stringify(utilisateurs));

    alert("Compte créé avec succès !");

    document.getElementById("registerNom").value = "";
    document.getElementById("registerEmail").value = "";
    document.getElementById("registerPassword").value = "";

}

function connecterUtilisateur() {

    utilisateurs = JSON.parse(localStorage.getItem("utilisateurs")) || [];

    const email = document.getElementById("loginEmail").value.trim();
    const mdp = document.getElementById("loginPassword").value.trim();

    const user = utilisateurs.find(u =>
        u.email === email && u.motDePasse === mdp
    );

    if (!user) {
        alert("Identifiants incorrects.");
        return;
    }

    utilisateurConnecte = user;

    localStorage.setItem("utilisateurConnecte", JSON.stringify(user));

    document.getElementById("landingPage").style.display = "none";
    document.getElementById("authPage").style.display = "none";
    document.getElementById("app").style.display = "block";

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