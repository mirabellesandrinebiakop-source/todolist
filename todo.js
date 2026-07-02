class Todo {

constructor(
    id,
    titre,
    description = "",
    statut = "a faire",
    priorite = "moyenne",
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
    this.statut = "terminee";
    this.dateFin = new Date();
}

copyWith(data) {
    return new Todo(
        this.id,
        data.titre ?? this.titre,
        data.description ?? this.description,
        data.statut ?? this.statut,
        data.priorite ?? this.priorite,
        this.dateCreation,
        data.dateFin ?? this.dateFin
    );
}

}