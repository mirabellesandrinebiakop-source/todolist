class Todo {

    constructor(
        id,
        titre,
        description,
        statut = "À faire",
        priorite = "Moyenne",
        dateCreation = new Date(),
        dateFin = null
    ) {

        this.id = id;
        this.titre = titre;
        this.description = description;
        this.statut = statut;
        this.priorite = priorite;
        this.dateCreation = dateCreation;
        this.dateFin = dateFin;
    }
    terminer() {

        this.statut = "Terminée";
        this.dateFin = new Date();

    }
    modifierTitre(nouveauTitre) {
        this.titre = nouveauTitre;
    }

    modifierDescription(nouvelleDescription) {
        this.description = nouvelleDescription;
    }

    modifierPriorite(nouvellePriorite) {

        const priorites = ["Haute", "Moyenne", "Basse"];

        if (priorites.includes(nouvellePriorite)) {
            this.priorite = nouvellePriorite;
        }
    }

    modifierStatut(nouveauStatut) {

        const statuts = ["À faire", "En cours", "Terminée"];

        if (statuts.includes(nouveauStatut)) {
            this.statut = nouveauStatut;
        }
    }
    copyWith({
        titre = null,
        description = null,
        statut = null,
        priorite = null,
        dateFin = null
    }) {

    return new Todo(
        this.id,
        titre ?? this.titre,
        description ?? this.description,
        statut ?? this.statut,
        priorite ?? this.priorite,
        this.dateCreation,
        dateFin ?? this.dateFin
    );
}

}