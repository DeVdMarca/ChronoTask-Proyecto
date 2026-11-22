const taskManager = new TaskManager();
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

   taskManager.addTask(nombre, "", fechaLimite, "PORHACER", carpetaElegida,prioridad);

   formularioTareas.reset();
   pintarTareas();
   actualizarContador();
      
});

function pintarTareas(textoFiltro =""){
    const contenedor = document.getElementById("taskContainer");
     if (!contenedor) {
        console.error("¡Error crítico! No encontré ninguna caja con el id 'taskContainer' en el HTML.");
        return;
    }
    contenedor.innerHTML = ""; // Limpiar el contenedor antes de pintar las tareas

    const tareasFiltradas =taskManager.tasks.filter(function(tarea) {
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

        const estadoActual = tarea.estado|| "Creada";
        const carpetaActual =tarea.carpeta || "general";

         const estructuraFila = `
        <tr class="tarjeta-hacker">
            <td class="fw-bold text-white">${tarea.titulo}</td>
            <td>
                <span class="badge bg-secondary bg-opacity-25 text-info border border-info">
                    <i class="bi bi-folder2 me-1"></i>${carpetaActual}
                </span>
            </td>
            <td>
                <span class="badge ${claseColor} text-uppercase">${tarea.impacto}</span>
            </td>
            <td>
                <span class="badge bg-dark text-light border border-secondary">${estadoActual}</span>
            </td>
            <td class="small text-warning fw-semibold">${fechaFormateada}</td>
            <td class="text-end">
                <button onclick="eliminarTareas(${tarea.id})" class="btn btn-sm btn-outline-danger border-0" title="Eliminar tarea">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
        `;
        contenedor.innerHTML += estructuraFila;
    })
 
}
console.log("¡Formulario detectado! El sensor está funcionando.");

function eliminarTareas(idRecibido) {
    taskManager.tasks = taskManager.tasks.filter(function(tarea) {
    return tarea.id !== idRecibido;
});
taskManager.saveToLocalStorage();

    pintarTareas();
    actualizarContador();
    //console.log("Tarea eliminada. Almacen de tareas actualizado:", listaTareas);
}

pintarTareas(); // Llama a la función para pintar las tareas al cargar la página
actualizarContador(); // Llama a la función para actualizar el contador al cargar la página

function actualizarContador() {
    const elementoContador = document.getElementById("taskCounter");
    if (elementoContador) {
        elementoContador.innerHTML = `${taskManager.tasks.length} Nodos Activos`;
    }
}

function pintarCarpetas(textoFiltro = ""){
      const contenedorMenu = document.getElementById("listaCarpetas");
      const selectFormulario = document.getElementById("selectCarpetaTarea");

      if(contenedorMenu){ contenedorMenu.innerHTML = `
        <button type="button" onclick="filtrarPorCarpeta('')" class="list-group-item list-group-item-action bg-transparent text-info border-secondary fw-bold">
            <i class="bi bi-grid-fill me-2"></i> Ver Todas las Tareas
        </button>
        `;
    }
      if(selectFormulario) selectFormulario.innerHTML ="";

    const carpetasFiltradas = listaCarpetas.filter(function(carpeta) {
    return carpeta.toLowerCase().includes(textoFiltro.toLowerCase());
    });
       
       carpetasFiltradas.forEach(function(carpeta, index) {
        if (contenedorMenu) {
            contenedorMenu.innerHTML += `
                <div class="list-group-item bg-transparent text-light border-secondary d-flex justify-content-between align-items-center">
                    <span onclick="filtrarPorCarpeta('${carpeta}')" style="cursor: pointer;" class="flex-grow-1">
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

// filtras las carpetas y asi poder cerrar automaticamente el menu

function filtrarPorCarpeta(nombreCarpeta){
    pintarCarpetas(nombreCarpeta);

    const panelLateral= document.getElementById("panelPeerfil");
    if (panelLateral){
        const instanciaOffcanvas = bootstrap.Offcanvas.getInstance(panelLateral);
        if(instanciaOffcanvas) instanciaOffcanvas.hide();
    }
}