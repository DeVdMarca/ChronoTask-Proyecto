# ⚡ ChronoTask (OrgaTime) — Planificador de Tareas (Sprint 2)

Aplicación web interactiva para la gestión inteligente de tareas personales y académicas, desarrollada con **HTML5, CSS3, Bootstrap 5 y JavaScript Vanilla (ES6+)** con persistencia de datos en **`localStorage`**.

---

## 🔗 Enlaces del Proyecto

* **🚀 Demo / Deploy en Vivo (GitHub Pages):** https://devdmarca.github.io/ChronoTask-Proyecto/
---

## 🎯 Alcance y Funcionalidades Desarrolladas en el Sprint 2

Durante el **Sprint 2 (JavaScript y Gestión de Tareas)** se implementó toda la lógica dinámica del cliente mediante programación orientada a objetos, manipulación del DOM y almacenamiento persistente:

### 1. Arquitectura de Datos (`TaskManager`)
* **Clase `TaskManager`:** Centraliza la colección de tareas (`this.tasks`), generación de identificadores únicos (`Date.now()`) y sincronización automática con `localStorage` (`saveToLocalStorage()` / `loadFromLocalStorage()`).
* **Creación Programada de Tareas:** Validación de formularios y creación dinámica de misiones con título, descripción, fecha límite, carpeta/categoría y nivel de impacto (`Alta`, `Media`, `Baja`).
* **Gestión de Estados y Subtareas:** Alternancia de estado (`PORHACER` / `COMPLETADA`) con actualización de contadores en tiempo real y soporte para listas de verificación (*checklists*) internas por tarea.
* **Eliminación de Tareas (`deleteTask(taskId)`):** Filtrado seguro por identificador numérico desde cada tarjeta/fila de la interfaz, actualización inmediata del DOM y persistencia tras recargar el navegador.

### 2. Características Interactivas Adicionales
* **Sistema de Gamificación (XP y Niveles):** Cálculo dinámico de puntos de experiencia según la prioridad de cada tarea completada, reflejado en una barra de progreso y rangos de usuario.
* **Centro de Mando Táctico:**
  * **Nodos de Carpeta:** Filtrado instantáneo por categoría con conteo de misiones en vivo.
  * **Radar Crítico (< 24h):** Detección automática de tareas vencidas o próximas a vencer en menos de 24 horas.
  * **Terminal Jarvis (Comandos y Voz):** Creación guiada paso a paso y control rápido mediante texto y reconocimiento/síntesis de voz (`Web Speech API`).
* **Modo Enfoque Neural:** Temporizador editable (`25`, `45` o `60` minutos) vinculado a una misión activa con captura rápida de distracciones.

---

## 📂 Estructura del Proyecto

```text
Planificador-Tareas/
├── css/
│   └── style.css         # Estilos personalizados, tema oscuro y bordes neón
├── js/
│   ├── taskManager.js    # Clase TaskManager (CRUD y persistencia en localStorage)
│   └── app.js            # Controlador del DOM, eventos, filtros, XP y Modo Enfoque
├── index.html            # Estructura principal y modales de Bootstrap 5
└── README.md             # Documentación del Sprint 2 y enlace de despliegue
```

---

## 🛠️ Tecnologías Utilizadas

* **HTML5** semántico
* **CSS3** (Variables, gradientes, animaciones y modo oscuro)
* **Bootstrap 5 & Bootstrap Icons** (Diseño responsivo y componentes modales)
* **JavaScript (ES6+)** (Clases, Arrays, Eventos del DOM, `localStorage` y `Web Speech API`)

---
## 👨‍💻 Autor

* **David Ricardo Marca Salazar** — *Desarrollo Frontend & Lógica JavaScript (Sprint 2)*



