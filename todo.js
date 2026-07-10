class Todo {

constructor(
    id,
    titre,
    description = "",
    statut = "a faire",
    priorite = "moyenne",
    dateCreation = new Date(),
    dateFin = null,
    dateLimite = null
) {
    this.id = id;
    this.titre = titre;
    this.description = description;
    this.statut = statut;
    this.priorite = priorite;
    this.dateCreation = dateCreation;
    this.dateFin = dateFin;
    this.dateLimite = dateLimite;
}

terminer() {
    this.statut = "terminee";
    this.dateFin = new Date();
}

modifierTitre(nouveauTitre){

    this.titre = nouveauTitre;

}

modifierDescription(nouvelleDescription){

    this.description = nouvelleDescription;

}

modifierPriorite(nouvellePriorite){

    this.priorite = nouvellePriorite;

}

modifierStatut(nouveauStatut){

    this.statut = nouveauStatut;

}

rouvrir(){

    this.statut = "a faire";

    this.dateFin = null;

}

estTerminee(){

    return this.statut === "terminee";

}

estEnCours(){

    return this.statut !== "terminee";

}

copyWith(data) {

    return new Todo(

        this.id,

        data.titre ?? this.titre,

        data.description ?? this.description,

        data.statut ?? this.statut,

        data.priorite ?? this.priorite,

        this.dateCreation,

        data.dateFin ?? this.dateFin,

        data.dateLimite ?? this.dateLimite

    );

}

getResume() {

    return `${this.titre} (${this.priorite})`;

}

}