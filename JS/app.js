let= listaTareas = [];

const formularioTareas = document.querySelector("#taskForm");

formularioTareas.addEventListener("submit", function(evento) {
    evento.preventDefault(); // Evita que el formulario se envíe de forma predeterminada


    const nombre = document.querySelector('#taskForm input[type="text"]').value;
    const prioridad = document.querySelector('#taskForm select').value;
    const fechaLimite = document.querySelector('#taskForm input[type="datetime-local"]').value;
    console.log("Actividad:", nombre, "// Prioridad:", prioridad, "// Límite:", fechaLimite);

    // .trim borra los espacios en blanco invisibles
    if(nombre.trim() ==="") { 
        alert( "porfavor , escribe el nombre de la actividad.");
        return;
    }
    if(fechaLimite.trim() ==="") {
        alert( "porfavor ,Ecojela fecha limite de la actividad.");
        return;
    }

    const nuevaTarea = {
        id: Date.now(),
        titulo: nombre,
        impacto: prioridad,
        fecha: fechaLimite

    };

    listaTareas.push(nuevaTarea);

    formularioTareas.reset(); // Limpia el formulario después de enviar la tarea
    pintarTareas(); // Llama a la función para pintar las tareas en el contenedor

    console.log("Almacen de tareas : " , listaTareas);

});

function pintarTareas(){
    const contenedor = document.getElementById("taskContainer");
     if (!contenedor) {
        console.error("¡Error crítico! No encontré ninguna caja con el id 'taskContainer' en el HTML.");
        return;
    }
    contenedor.innerHTML = ""; // Limpiar el contenedor antes de pintar las tareas

    listaTareas.forEach(function(tarea){

        const fechaFormateada = tarea.fecha.replace("T", " ➔ ");

        let claseColor = ""; 

        const impactoMinuscula = tarea.impacto.toLowerCase(); 
        if ( impactoMinuscula === "alta") {
            claseColor = "bg-danger text-white";
        } else if (impactoMinuscula === "media") {
            claseColor = "bg-warning text-dark";
        } else {
            claseColor = "bg-success text-white";
        }
        const estructuraTarjeta = `
        <div class="col">
            <div class="card bg-secondary bg-opacity-10 text-light border-secondary p-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="fw-bold m-0 text-white">${tarea.titulo}</h6>
                    <span class="badge ${claseColor} fs-xs text-uppercase">${tarea.impacto}</span>
                </div>
                <p class="small text-warning m-0 fw-semibold">Límite: ${fechaFormateada}</p>
            </div>
        </div>
        `;
        contenedor.innerHTML += estructuraTarjeta;
    })

}

console.log("¡Formulario detectado! El sensor está funcionando.");










