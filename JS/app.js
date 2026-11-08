let= listaTareas = JSON.parse(localStorage.getItem("misTareasGuardadas")) || [];

const formularioTareas = document.querySelector("#taskForm");

formularioTareas.addEventListener("submit", function(evento) {
    evento.preventDefault(); // Evita que el formulario se envíe de forma predeterminada


    const nombre = document.querySelector('#taskForm input[type="text"]').value;
    const prioridad = document.querySelector('#taskForm select').value;
    const fechaLimite = document.querySelector('#taskForm input[type="datetime-local"]').value;
   // console.log("Actividad:", nombre, "// Prioridad:", prioridad, "// Límite:", fechaLimite);

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
    localStorage.setItem("misTareasGuardadas", JSON.stringify(listaTareas));

    formularioTareas.reset(); // Limpia el formulario después de enviar la tarea
    pintarTareas(); // Llama a la función para pintar las tareas en el contenedor
    actualizarContador(); // Llama a la función para actualizar el contador de tareas

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
                <button onclick="eliminarTareas(${tarea.id})" class="btn-close btn-close-white position-absolute top-0 end-0 m-2 fs-xs" style="font-size: 0.75rem;" aria-label="Eliminar"></button>
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

function eliminarTareas(idRecibido) {
    listaTareas= listaTareas.filter(function(tarea) {
        return tarea.id !== idRecibido;
    });

    localStorage.setItem("misTareasGuardadas", JSON.stringify(listaTareas));

    pintarTareas();
    actualizarContador();
    //console.log("Tarea eliminada. Almacen de tareas actualizado:", listaTareas);
}

pintarTareas(); // Llama a la función para pintar las tareas al cargar la página
actualizarContador(); // Llama a la función para actualizar el contador al cargar la página

function actualizarContador() {
    const elementoContador = document.getElementById("taskCounter");
    if (elementoContador) {
        elementoContador.innerHTML = `${listaTareas.length} Nodos Activos`;
    }
}


