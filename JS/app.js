
const formularioTareas = document.querySelector("#taskForm");
formularioTareas.addEventListener("submit", function(evento) {
evento.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
console.log("¡Formulario detectado! El sensor está funcionando.");

const nombre = document.querySelector('taskForm input[type="text"]').value;
const prioridad = document.querySelector('taskForm select').value;
const fechaLimite = document.querySelector('taskForm input[type="datetime-local"]').value;
console.log("Actividad:", nombre, "// Prioridad:", prioridad, "// Límite:", fechaLimite);

});

const nuevaTarea = {
    id: Date.now(),
    titulo: nombre,
    impacto:prioridad,
    fecha: fechaLimite

};
// .trim borra los espacios en blanco invisibles
if(nombre.trim() ==="") { 
    alert( "porfavor , escribe el nombre de la actividad.");
    return;
}
if(fechaLimite.trim() ==="") {
    alert( "porfavor ,Ecojela fecha limite de la actividad.");
    return;
}

if(prioridad.trim() ==="") {
    alert( "porfavor , escoje la prioridad de la actividad.");
    return;
}


