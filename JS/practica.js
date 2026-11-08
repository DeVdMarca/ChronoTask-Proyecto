let listaDeTareas = []

const formularioAtreas= documento.querySelector("#taskform");
formularioTareas.addEventListener("submit", function(evento) {
    evento.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    const nombre = document.querySelector('taskForm input[type=text]').value;
    const prioridad = document.querySelector('taskForm select').value;
    const fechaLimite = document.querySelector('taskForm input[type=datetime-local]').value;
    
    if (nombre.trim() ==="") {
        alert("Por favor, escribe el nombre de la actividad.");
        return;
    }
    if (fechaLimite.trim() ==="") {
        alert("Por favor, elige la fecha límite de la actividad.");
        return;
    }

    const nuevaTarea ={
        id:Date.now(),
        titulo:nombre,
        impacto:prioridad,
        fecha:fechaLimite
    }
    listaDeTareas.push(nuevaTarea);

    formularioTareas.reset(); // Limpia el formulario después de enviar la tarea

    console.log("Almacen de tareas:", listaDeTareas);
});