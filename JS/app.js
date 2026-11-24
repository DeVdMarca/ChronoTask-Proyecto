const taskManager = new TaskManager();
let listaCarpetas = JSON.parse(localStorage.getItem("misCarpetasGuardadas")) || [];
let xpTotal = Number(localStorage.getItem("chrono_xp_total")) || 0;
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

        const estadoActual = tarea.estado|| "PORHACER";
        const estaCompletada =tarea.carpeta || "COMPLETADA";

        const estiloTitulo = estaCompletada ? "text-decoration-line-through text-secondary" : "text-white";
        const colorEstado = estaCompletada ? "bg-success text-white" : "bg-dark text-info border border-info";
       

        const carpetaActual = tarea.carpeta || "general";


         const estructuraFila = `
        <tr class="tarjeta-hacker">
            <td class="fw-bold ${estiloTitulo}">${tarea.titulo}</td>
            <td>
                <span class="badge bg-secondary bg-opacity-25 text-info border border-info">
                    <i class="bi bi-folder2 me-1"></i>${carpetaActual}
                </span>
            </td>
            <td>
                <span class="badge ${claseColor} text-uppercase">${tarea.impacto}</span>
            </td>
            <td>
                <span class="badge ${colorEstado}">${estadoActual}</span>
            </td>
           <td class="small text-warning fw-semibold">${fechaFormateada}</td>

            <!-- 6. Acciones (Enfoque + Detalles + Completar + Eliminar) -->
            <td class="text-end text-nowrap">
                <button onclick="abrirModoEnfoque(${tarea.id})" 
                        class="btn btn-sm btn-outline-info me-1" 
                        title="Iniciar Modo Enfoque con Voz">
                    <i class="bi bi-bullseye"></i> Enfoque
                </button>
                <button onclick="abrirModalTarea(${tarea.id})" 
                        class="btn btn-sm btn-outline-warning me-1" 
                        title="Abrir descripción y checklist">
                    <i class="bi bi-card-text"></i>
                </button>
                <button onclick="alternarEstadoTarea(${tarea.id})" 
                        class="btn btn-sm ${estaCompletada ? 'btn-success' : 'btn-outline-success'} me-1" 
                        title="${estaCompletada ? 'Reactivar tarea' : 'Completar tarea'}">
                    <i class="bi ${estaCompletada ? 'bi-check-circle-fill' : 'bi-check2'}"></i>
                    ${estaCompletada ? 'Lista' : 'Completar'}
                </button>
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

function alternarEstadoTarea(idRecibido) {
    // Convertimos ambos IDs a Number para que siempre encuentre la tarea
    const tarea = taskManager.tasks.find(t => Number(t.id) === Number(idRecibido));
    if (!tarea) {
        console.error("No encontré la tarea con ID:", idRecibido);
        return;
    }

    const puntos = obtenerPuntosPorPrioridad(tarea.impacto);
    const yaEstabaCompletada = (tarea.status === "COMPLETADA");

    if (!yaEstabaCompletada) {
        tarea.status = "COMPLETADA";
        tarea.estado = "COMPLETADA";
        modificarExperiencia(puntos);
    } else {
        tarea.status = "PORHACER";
        tarea.estado = "PORHACER";
        modificarExperiencia(-puntos);
    }

    taskManager.saveToLocalStorage();
    pintarTareas();
    if (typeof actualizarContador === "function") actualizarContador();
}

pintarTareas(); // Llama a la función para pintar las tareas al cargar la página
actualizarContador(); // Llama a la función para actualizar el contador al cargar la página
actualizarBarraSincronizacion();

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

// MODAL DE TAREAS

let tareaActivaId = null;

function abrirModalTarea(idRecibido){
    const tarea = taskManager.getTaskById(idRecibido);
    if (!tarea) return;

    tareaActivaId = idRecibido;

    document.getElementById("modalTituloTarea").textContent = tarea.titulo;
    document.getElementById("modalMetaTarea").textContent = `carpeta: ${tarea.carpeta || "General"}• Prioridad: ${tarea.impacto.toUpperCase()} • limite: ${tarea.fecha.replace("T", "")}`
    document.getElementById("modalDescripcionInput").value = tarea.description || tarea.descripcion || "";

    evaluarAlertaTiempo(tarea);

    if(!tarea.checklist){
        tarea.checklist = [];

    }

    pintarChecklistModal(tarea);

    const elementoModal = document.getElementById("modalDetalleTarea");
    const modalBootstrap = bootstrap.Modal.getOrCreateInstance(elementoModal);
    modalBootstrap.show();

}

function evaluarAlertaTiempo (tarea){
    const cajaAlerta = document.getElementById("modalAlertaTiempo");
    if(!tarea.fecha || tarea.status === "COMPLETADA"){
        cajaAlerta.className = "alerta d-none";
        return;
    }

    const ahora= new Date();
    const limite = new Date(tarea.fecha);
    const horaRestantes = (limite - ahora) / (1000 * 60 * 60);
    
    if (horaRestantes <= 0 ){
        cajaAlerta.className =  "alert alert-danger py-2 small fw-semibold";
        cajaAlerta.innerHTML =  `<i class="bi bi-exclamation-triangle-fill me-1"></i> ¡Atención! Esta tarea ya está vencida.`;
    } else if (horaRestantes <= 24) {
        cajaAlerta.className = "alert alert-warning text-dark py-2 small fw-semibold";
        cajaAlerta.innerHTML = `<i class="bi bi-hourglass-split me-1"></i> ¡Queda poco tiempo! Vence en menos de ${Math.ceil(horaRestantes)} horas.`;
        
    } else {
        cajaAlerta.className = "alert d-none";
    }
}

function pintarChecklistModal(tarea) {
    const listaUl = document.getElementById("modalListaChecklist");
    listaUl.innerHTML = "";

    if (tarea.checklist.length === 0) {
        listaUl.innerHTML = `<li class="list-group-item bg-transparent text-secondary small border-0">Aún no hay subtareas. Añade la primera arriba.</li>`;
        return;
    }

    tarea.checklist.forEach(function(item, indice) {
        const estiloTexto = item.hecha ? "text-decoration-line-through text-secondary" : "text-light";
        const marcado = item.hecha ? "checked" : "";

        listaUl.innerHTML += `
            <li class="list-group-item bg-black text-light border-secondary d-flex justify-content-between align-items-center">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" ${marcado} onchange="alternarSubtarea(${indice})" id="subtarea-${indice}">
                    <label class="form-check-label ${estiloTexto}" for="subtarea-${indice}" style="cursor: pointer;">
                        ${item.texto}
                    </label>
                </div>
                <button onclick="eliminarSubtarea(${indice})" class="btn btn-sm btn-outline-danger border-0 py-0">
                    <i class="bi bi-x-lg"></i>
                </button>
            </li>
        `;
    });
}

// Evento: Guardar descripción editada
document.getElementById("btnGuardarDescripcion")?.addEventListener("click", function() {
    const tarea = taskManager.getTaskById(tareaActivaId);
    if (!tarea) return;

    const nuevaDesc = document.getElementById("modalDescripcionInput").value.trim();
    tarea.description = nuevaDesc;
    tarea.descripcion = nuevaDesc;
    taskManager.saveToLocalStorage();

    alert("¡Descripción guardada!");
});

// Evento: Añadir subtarea a la checklist
document.getElementById("btnAgregarSubtarea")?.addEventListener("click", function() {
    const tarea = taskManager.getTaskById(tareaActivaId);
    const inputSub = document.getElementById("modalInputSubtarea");
    const texto = inputSub.value.trim();

    if (!tarea || texto === "") return;

    tarea.checklist.push({ texto: texto, hecha: false });
    taskManager.saveToLocalStorage();
    inputSub.value = "";
    pintarChecklistModal(tarea);
});

function alternarSubtarea(indice) {
    const tarea = taskManager.getTaskById(tareaActivaId);
    if (!tarea) return;

    tarea.checklist[indice].hecha = !tarea.checklist[indice].hecha;
    taskManager.saveToLocalStorage();
    pintarChecklistModal(tarea);
}

function eliminarSubtarea(indice) {
    const tarea = taskManager.getTaskById(tareaActivaId);
    if (!tarea) return;
    

    tarea.checklist.splice(indice, 1);
    taskManager.saveToLocalStorage();
    pintarChecklistModal(tarea);
}


let vistaActual = "todas"; // Puede ser: "todas", "importantes", "completadas"

function cambiarVistaFiltro(nuevaVista) {
    vistaActual = nuevaVista;
    pintarTareas();
}

let mesCalendario = new Date().getMonth();
let anioCalendario = new Date().getFullYear();

function abrirCalendario() {
    renderizarCalendario();
    const modalCal = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalCalendario"));
    modalCal.show();
}

function cambiarMesCalendario(delta) {
    mesCalendario += delta;

    // Si retrocedemos antes de Enero (0), pasamos a Diciembre (11) del año anterior
    if (mesCalendario < 0) {
        mesCalendario = 11;
        anioCalendario--;
    } 
    // Si avanzamos después de Diciembre (11), pasamos a Enero (0) del año siguiente
    else if (mesCalendario > 11) {
        mesCalendario = 0;
        anioCalendario++;
    }

    renderizarCalendario();
}

function cambiarAnioCalendario(nuevoAnio) {
    const anioNumerico = parseInt(nuevoAnio);
    if (!isNaN(anioNumerico) && anioNumerico >= 1970 && anioNumerico <= 2100) {
        anioCalendario = anioNumerico;
        renderizarCalendario();
    }
}

function irAHoyCalendario() {
    const hoy = new Date();
    mesCalendario = hoy.getMonth();
    anioCalendario = hoy.getFullYear();
    renderizarCalendario();
}

function renderizarCalendario() {
    const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    const tituloMes = document.getElementById("tituloMesCalendario");
    if (tituloMes) tituloMes.textContent = `${nombresMeses[mesCalendario]} ${anioCalendario}`;

    const inputAnio = document.getElementById("inputAnioCalendario");
    if (inputAnio) inputAnio.value = anioCalendario;

    const grid = document.getElementById("gridCalendario");
    if (!grid) return;
    grid.innerHTML = "";

    const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    diasSemana.forEach(d => {
        grid.innerHTML += `<div class="text-center text-secondary small fw-bold py-1">${d}</div>`;
    });

    const primerDiaSemana = new Date(anioCalendario, mesCalendario, 1).getDay();
    const totalDiasMes = new Date(anioCalendario, mesCalendario + 1, 0).getDate();

    for (let i = 0; i < primerDiaSemana; i++) {
        grid.innerHTML += `<div></div>`;
    }

    for (let dia = 1; dia <= totalDiasMes; dia++) {
        const fechaStr = `${anioCalendario}-${String(mesCalendario + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
        const tareasDelDia = taskManager.tasks.filter(t => t.fecha && t.fecha.startsWith(fechaStr));
        const tieneTareas = tareasDelDia.length > 0;

        const claseBoton = tieneTareas 
            ? "btn-info text-dark fw-bold shadow-sm" 
            : "btn-outline-secondary text-light";

        grid.innerHTML += `
            <button type="button" onclick="mostrarTareasDeFecha('${fechaStr}')" class="btn ${claseBoton} py-2 position-relative">
                ${dia}
                ${tieneTareas ? `<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">${tareasDelDia.length}</span>` : ""}
            </button>
        `;
    }
}

function mostrarTareasDeFecha(fechaStr) {
    const cajaDetalle = document.getElementById("detalleDiaCalendario");
    const listaUl = document.getElementById("listaTareasDia");
    const tituloFecha = document.getElementById("fechaSeleccionadaTexto");

    const tareas = taskManager.tasks.filter(t => t.fecha && t.fecha.startsWith(fechaStr));
    cajaDetalle.classList.remove("d-none");
    tituloFecha.textContent = `Tareas programadas para el ${fechaStr}:`;
    listaUl.innerHTML = "";

    if (tareas.length === 0) {
        listaUl.innerHTML = `<li class="list-group-item bg-transparent text-secondary small border-0">No hay tareas programadas para este día.</li>`;
        return;
    }

    tareas.forEach(t => {
        listaUl.innerHTML += `
            <li class="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center">
                <span><strong>${t.titulo}</strong> <small class="text-info">(${t.carpeta || "General"})</small></span>
                <span class="badge ${t.status === 'COMPLETADA' ? 'bg-success' : 'bg-warning text-dark'}">${t.status}</span>
            </li>
        `;
    });
}



function obtenerPuntosPorPrioridad(impacto){
     if (!impacto) return 15;
    const nivel = impacto.toLowerCase();
    if (nivel === "alta") return 50;
    if (nivel === "media") return 30;
    return 15;
}

function obtenerNombreRango(nivel) {
    if (nivel >= 10) return "Arquitecto Supremo Chrono";
    if (nivel >= 7) return "Ingeniero Cibernético";
    if (nivel >= 4) return "Desarrollador Full-Stack";
    if (nivel >= 2) return "Operador de Sistemas";
    return "Novato del Código";
}

function modificarExperiencia(cantidadPuntos) {
    xpTotal = Math.max(0, xpTotal + cantidadPuntos); 
    localStorage.setItem("chrono_xp_total", xpTotal);
    actualizarBarraSincronizacion();
}

function actualizarBarraSincronizacion() {
    const nivelActual = Math.floor(xpTotal / 100) + 1;
    const progresoNivel = xpTotal % 100; 
    const nombreRango = obtenerNombreRango(nivelActual);

    const badgeRango = document.getElementById("rangoNucleo");
    const textoXp = document.getElementById("textoNivelXp");
    const barra = document.getElementById("barraSincronizacion");

    if (badgeRango) badgeRango.innerHTML = `<i class="bi bi-cpu-fill me-1"></i>${nombreRango}`;
    if (textoXp) textoXp.textContent = `Nivel ${nivelActual} • ${progresoNivel} / 100 XP (Total: ${xpTotal})`;
    
    if (barra) {
        barra.style.width = `${progresoNivel}%`;
        barra.setAttribute("aria-valuenow", progresoNivel);
        barra.textContent = `${progresoNivel}%`;
    }
}

// ========================================================
// MÓDULO DE ENFOQUE NEURAL + ASISTENTE DE VOZ + CAPTURA RÁPIDA
// ========================================================
let tareaEnfoqueId = null;
let intervaloEnfoque = null;
let segundosTotalesBloque = 25 * 60;
let segundosRestantesEnfoque = 25 * 60;
let avisoMitadEnviado = false;

let vocesDisponibles = [];

function cargarVocesSuaves() {
    if (!("speechSynthesis" in window)) return;
    vocesDisponibles = window.speechSynthesis.getVoices();
}

// Los navegadores cargan las voces de forma asíncrona
if ("speechSynthesis" in window) {
    cargarVocesSuaves();
    window.speechSynthesis.onvoiceschanged = cargarVocesSuaves;
}

function hablarAsistente(mensaje) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    if (vocesDisponibles.length === 0) {
        vocesDisponibles = window.speechSynthesis.getVoices();
    }

    const locucion = new SpeechSynthesisUtterance(mensaje);

    // Orden de prioridad: voces naturales de España (es-ES) o Catalán (ca-ES)
    const vozElegida =
        vocesDisponibles.find(v => v.name.includes("Elvira") && v.lang.includes("es-ES")) ||
        vocesDisponibles.find(v => v.name.includes("Alvaro") && v.lang.includes("es-ES")) ||
        vocesDisponibles.find(v => v.name.includes("Google español") && v.lang === "es-ES") ||
        vocesDisponibles.find(v => v.lang === "es-ES" && v.name.includes("Natural")) ||
        vocesDisponibles.find(v => v.lang === "ca-ES") ||
        vocesDisponibles.find(v => v.lang === "es-ES");

    if (vozElegida) {
        locucion.voice = vozElegida;
        locucion.lang = vozElegida.lang;
    } else {
        locucion.lang = "es-ES";
    }

    // Ajuste suave: un poco más pausada y con entonación cálida
    locucion.rate = 0.94;
    locucion.pitch = 1.05;
    locucion.volume = 0.95;

    window.speechSynthesis.speak(locucion);
}

// 2. Abrir el Modal aislando la tarea elegida
function abrirModoEnfoque(idRecibido) {
    const tarea = taskManager.tasks.find(t => Number(t.id) === Number(idRecibido));
    if (!tarea) return;

    tareaEnfoqueId = Number(idRecibido);
    pausarTemporizadorEnfoque();
    configurarTiempoEnfoque(25);

    // Pintar datos de la misión
    document.getElementById("enfoqueTituloTarea").textContent = tarea.titulo;
    document.getElementById("enfoquePrioridadBadge").textContent = (tarea.impacto || "Media").toUpperCase();

    // Pintar checklist interna dentro del modo enfoque
    pintarChecklistEnfoque(tarea);

    const modalEnf = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalModoEnfoque"));
    modalEnf.show();
}

function pintarChecklistEnfoque(tarea) {
    const listaUl = document.getElementById("enfoqueListaChecklist");
    listaUl.innerHTML = "";

    if (!tarea.checklist || tarea.checklist.length === 0) {
        listaUl.innerHTML = `<li class="list-group-item bg-black text-secondary small border-0">Esta misión no tiene subtareas. Concéntrate en el objetivo principal.</li>`;
        return;
    }

    tarea.checklist.forEach((item, indice) => {
        const estilo = item.hecha ? "text-decoration-line-through text-secondary" : "text-light";
        const marcado = item.hecha ? "checked" : "";

        listaUl.innerHTML += `
            <li class="list-group-item bg-black text-light border-secondary d-flex align-items-center">
                <input class="form-check-input me-2" type="checkbox" ${marcado} onchange="alternarSubtareaDesdeEnfoque(${indice})" id="enf-sub-${indice}">
                <label class="form-check-label ${estilo}" for="enf-sub-${indice}" style="cursor: pointer;">
                    ${item.texto}
                </label>
            </li>
        `;
    });
}

function alternarSubtareaDesdeEnfoque(indice) {
    const tarea = taskManager.tasks.find(t => Number(t.id) === tareaEnfoqueId);
    if (!tarea || !tarea.checklist[indice]) return;

    tarea.checklist[indice].hecha = !tarea.checklist[indice].hecha;
    taskManager.saveToLocalStorage();
    pintarChecklistEnfoque(tarea);
}

// 3. Control del Reloj Editable (25, 45, 60 min)
function configurarTiempoEnfoque(minutos) {
    pausarTemporizadorEnfoque();
    segundosTotalesBloque = minutos * 60;
    segundosRestantesEnfoque = segundosTotalesBloque;
    avisoMitadEnviado = false;
    actualizarDisplayRelojEnfoque();
}

function actualizarDisplayRelojEnfoque() {
    const mins = Math.floor(segundosRestantesEnfoque / 60);
    const segs = segundosRestantesEnfoque % 60;
    const formato = `${String(mins).padStart(2, "0")}:${String(segs).padStart(2, "0")}`;
    const display = document.getElementById("relojEnfoqueDisplay");
    if (display) display.textContent = formato;
}

function iniciarTemporizadorEnfoque() {
    if (intervaloEnfoque) return; // Evita doble temporizador si ya está corriendo

    const tarea = taskManager.tasks.find(t => Number(t.id) === tareaEnfoqueId);
    if (!tarea) return;

    // Buscar primera subtarea pendiente para que el asistente la lea
    const primeraPendiente = tarea.checklist?.find(sub => !sub.hecha);
    const minutosElegidos = Math.round(segundosRestantesEnfoque / 60);

    let mensajeInicio = `Iniciando bloque de enfoque de ${minutosElegidos} minutos para la misión: ${tarea.titulo}.`;
    if (primeraPendiente) {
        mensajeInicio += ` Tu primera subtarea pendiente es: ${primeraPendiente.texto}.`;
    }
    hablarAsistente(mensajeInicio);

    intervaloEnfoque = setInterval(() => {
        segundosRestantesEnfoque--;
        actualizarDisplayRelojEnfoque();

        // Aviso suave justo a mitad del bloque
        const mitad = Math.floor(segundosTotalesBloque / 2);
        if (!avisoMitadEnviado && segundosRestantesEnfoque === mitad && mitad > 30) {
            avisoMitadEnviado = true;
            hablarAsistente("Vas por la mitad del bloque de enfoque. Mantén el ritmo.");
        }

        // Al llegar a 00:00
        if (segundosRestantesEnfoque <= 0) {
            pausarTemporizadorEnfoque();
            hablarAsistente("Tiempo completado. Es momento de un descanso.");

            setTimeout(() => {
                const deseaCompletar = confirm(`¡Bloque finalizado para "${tarea.titulo}"!\n\n• Presiona ACEPTAR para marcar la tarea como COMPLETADA (+XP).\n• Presiona CANCELAR para sumar 15 minutos extra de enfoque.`);
                if (deseaCompletar) {
                    completarTareaDesdeEnfoque();
                } else {
                    configurarTiempoEnfoque(15);
                    iniciarTemporizadorEnfoque();
                }
            }, 400);
        }
    }, 1000);
}

function pausarTemporizadorEnfoque() {
    if (intervaloEnfoque) {
        clearInterval(intervaloEnfoque);
        intervaloEnfoque = null;
    }
}

function reiniciarTemporizadorEnfoque() {
    pausarTemporizadorEnfoque();
    segundosRestantesEnfoque = segundosTotalesBloque;
    avisoMitadEnviado = false;
    actualizarDisplayRelojEnfoque();
}

function cerrarModoEnfoque() {
    pausarTemporizadorEnfoque();
    window.speechSynthesis?.cancel();
    const modalEl = document.getElementById("modalModoEnfoque");
    bootstrap.Modal.getInstance(modalEl)?.hide();
}

// 4. Completar la misión directo desde el Modo Enfoque
function completarTareaDesdeEnfoque() {
    const tarea = taskManager.tasks.find(t => Number(t.id) === tareaEnfoqueId);
    if (tarea && tarea.status !== "COMPLETADA") {
        alternarEstadoTarea(tarea.id);
        hablarAsistente(`Misión ${tarea.titulo} completada. Experiencia sincronizada en el núcleo.`);
    }
    cerrarModoEnfoque();
}

// 5. Captura Rápida de Distracciones (3 segundos)
function guardarDistraccionRapida() {
    const input = document.getElementById("inputCapturaRapida");
    const texto = input.value.trim();
    if (!texto) return;

    // Fecha de hoy en formato compatible con tu tabla
    const hoyStr = new Date().toISOString().slice(0, 16);

    taskManager.addTask(
        texto,
        "Capturada rápidamente durante sesión de enfoque",
        hoyStr,
        "General",
        "baja"
    );

    input.value = "";
    pintarTareas();
    if (typeof actualizarContador === "function") actualizarContador();

    hablarAsistente("Distracción guardada en tu lista para más tarde.");
}
