let listaTareas = JSON.parse(localStorage.getItem("misTareasGuardadas")) || [];
let listaCarpetas = JSON.parse(localStorage.getItem("misCarpetasGuardadas")) || [];

const formularioTareas = document.querySelector("#taskForm");

formularioTareas.addEventListener("submit", function(evento) {
    evento.preventDefault(); // Evita que el formulario se envíe de forma predeterminada


    const nombre = document.querySelector('#taskForm input[type="text"]').value;
    const prioridad = document.querySelector('#taskForm select').value;
    const fechaLimite = document.querySelector('#taskForm input[type="datetime-local"]').value;
    const carpetaElegida = document.getElementById("selectCarpetaTarea").value;
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
        fecha: fechaLimite,
        carpeta: carpetaElegida

    };

    listaTareas.push(nuevaTarea);
    localStorage.setItem("misTareasGuardadas", JSON.stringify(listaTareas));

    formularioTareas.reset(); // Limpia el formulario después de enviar la tarea
    pintarTareas(); // Llama a la función para pintar las tareas en el contenedor
    actualizarContador(); // Llama a la función para actualizar el contador de tareas

    console.log("Almacen de tareas : " , listaTareas);

});

function pintarTareas(textoFiltro =""){
    const contenedor = document.getElementById("taskContainer");
     if (!contenedor) {
        console.error("¡Error crítico! No encontré ninguna caja con el id 'taskContainer' en el HTML.");
        return;
    }
    contenedor.innerHTML = ""; // Limpiar el contenedor antes de pintar las tareas

    const tareasFiltradas = listaTareas.filter(function(tarea) {
    const coincideTitulo = tarea.titulo.toLowerCase().includes(textoFiltro.toLowerCase());
    const coincideCarpeta = tarea.carpeta && tarea.carpeta.toLowerCase().includes(textoFiltro.toLowerCase());
    return coincideTitulo || coincideCarpeta;
});

    tareasFiltradas.forEach(function(tarea){

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
            <div class="card bg-secondary bg-opacity-10 text-light border-secondary p-3 tarjeta-hacker">
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

function pintarCarpetas(textoFiltro = ""){
      const contenedorMenu = document.getElementById("listaCarpetas");
      const selectFormulario = document.getElementById("selectCarpetaTarea");

      if(contenedorMenu) contenedorMenu.innerHTML = "";
      if(selectFormulario) selectFormulario.innerHTML ="";

    const carpetasFiltradas = listaCarpetas.filter(function(carpeta) {
    return carpeta.toLowerCase().includes(textoFiltro.toLowerCase());
    });
       
       carpetasFiltradas.forEach(function(carpeta, index) {
        if (contenedorMenu) {
            contenedorMenu.innerHTML += `
                <div class="list-group-item bg-transparent text-light border-secondary d-flex justify-content-between align-items-center">
                    <span>
                        <i class="bi bi-folder2-open text-info me-2"></i> ${carpeta}
                    </span>
                    <div class="btn-group btn-group-sm">
                        <button type="button" onclick="editarCarpeta(${index})" class="btn btn-outline-warning border-0" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" onclick="eliminarCarpeta(${index})" class="btn btn-outline-danger border-0" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }
        if (selectFormulario) {
            selectFormulario.innerHTML += `<option value="${carpeta}">${carpeta}</option>`;
        }

        
    });
}

pintarCarpetas(textoFiltro ="");

const btnGuardarCarpeta = document.getElementById("btnGuardarCarpeta");

if (btnGuardarCarpeta) {
    btnGuardarCarpeta.addEventListener("click", function() {
        const inputCarpeta = document.getElementById("inputNombreCarpeta");
        const nombreLimpio = inputCarpeta.value.trim();

        if (nombreLimpio !== "") {
            listaCarpetas.push(nombreLimpio);
            localStorage.setItem("misCarpetasGuardadas", JSON.stringify(listaCarpetas));
            
            inputCarpeta.value = ""; // Limpiamos la caja de texto
            pintarCarpetas(textoFiltro=""); 
        }
    });
}

let indiceCarpetaEdicion = null;

function editarCarpeta(indice) {
    indiceCarpetaEdicion = indice;
    const inputEditar = document.getElementById("inputEditarCarpeta");
    const cajaEditar = document.getElementById("cajaEditarCarpeta");

    if (inputEditar && cajaEditar) {
        inputEditar.value = listaCarpetas[indice]; // Ponemos el nombre actual adentro
        
        
        const bsCollapse = new bootstrap.Collapse(cajaEditar, { toggle: false });
        bsCollapse.show();
        inputEditar.focus(); 
    }
}


const btnActualizarCarpeta = document.getElementById("btnActualizarCarpeta");

if (btnActualizarCarpeta) {
    btnActualizarCarpeta.addEventListener("click", function() {
        const inputEditar = document.getElementById("inputEditarCarpeta");
        const cajaEditar = document.getElementById("cajaEditarCarpeta");
        const nuevoNombre = inputEditar.value.trim();

        if (nuevoNombre !== "" && indiceCarpetaEdicion !== null) {
            listaCarpetas[indiceCarpetaEdicion] = nuevoNombre;
            localStorage.setItem("misCarpetasGuardadas", JSON.stringify(listaCarpetas));
            
            pintarCarpetas(textoFiltro=""); 
            
            // Cerramos la caja desplegable
            const bsCollapse = bootstrap.Collapse.getInstance(cajaEditar);
            if (bsCollapse) bsCollapse.hide();
            
            indiceCarpetaEdicion = null; // Limpiamos la memoria temporal
        }
    });
}

function eliminarCarpeta(indice) {
    const confirmar = confirm(`¿Seguro que deseas eliminar la carpeta "${listaCarpetas[indice]}"?`);
    
    if (confirmar) {
        listaCarpetas.splice(indice, 1); // Eliminamos 1 elemento en esa posición
        localStorage.setItem("misCarpetasGuardadas", JSON.stringify(listaCarpetas));
        pintarCarpetas(textoFiltro=""); 
    }
}

const buscadorGlobal = document.getElementById("buscadorGlobal");

if (buscadorGlobal) {
    buscadorGlobal.addEventListener("input", function(evento) {
        const textoEscrito = evento.target.value.trim();
        
        // Ejecutamos ambas funciones enviándoles el texto escrito
        pintarCarpetas(textoEscrito);
        pintarTareas(textoEscrito);
    });
}