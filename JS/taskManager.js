class TaskManager{
    constructor(currentId = 0){
        this.tasks = JSON.parse(localStorage.getItem("misTareasGuardadas")) || [];

        if(this.tasks.length > 0 ){
            const maxId= Math.max(...this.tasks.map(t =>t.id));
            this.currentId = maxId;

        } else{
            this.currentId = currentId;
        }
    }



    addTask(name, description = "", dueDate = "", status = "PORHACER", carpeta = "Personal", impacto = "media") {

        this.currentId++;

     const nuevaTarea = {
        id: this.currentId,
        name: name,
        titulo: name,
        description:description,
        descripcion:description,
        dueDate: dueDate,
        fecha: dueDate,
        status: status,
        carpeta:  carpeta,
        impacto: impacto,
        checklist: []
        };

        this.tasks.push(nuevaTarea);
        this.saveToLocalStorage();
        return nuevaTarea;
    }

    saveToLocalStorage(){
        localStorage.setItem("misTareasGuardadas", JSON.stringify(this.tasks));
    }
    getTaskById(taskId){
        return this.tasks.find(t=> t.id === taskId);
    }
}