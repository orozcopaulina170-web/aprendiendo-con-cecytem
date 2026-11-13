/* ==========================================
   MISION CEREBRITO
   FUNCIONES E INTERACCIONES
========================================== */

const actividades = {

    lengua: [

        {
            id: "len1",
            nivel: 1,
            titulo: "Comprensión lectora",
            pregunta: "María plantó un árbol y cada tarde lo regaba. ¿Cuál es la idea principal?",
            opciones: [
                "María cuida un árbol.",
                "María compró hojas.",
                "María juega en el patio."
            ],
            respuesta: 0,
            explicacion: "La idea principal es que María plantó y cuida un árbol."
        },

        {
            id: "len2",
            nivel: 1,
            titulo: "Sinónimos",
            pregunta: "¿Cuál es un sinónimo de alegre?",
            opciones: [
                "Triste",
                "Feliz",
                "Enojado"
            ],
            respuesta: 1,
            explicacion: "Feliz y alegre tienen significados parecidos."
        },

        {
            id: "len3",
            nivel: 2,
            titulo: "Géneros literarios",
            pregunta: "¿Qué género está pensado para representarse mediante actores?",
            opciones: [
                "Lírico",
                "Dramático",
                "Narrativo"
            ],
            respuesta: 1,
            explicacion: "El género dramático está destinado a representarse en escena."
        },

        {
            id: "len4",
            nivel: 2,
            titulo: "Antónimos",
            pregunta: "¿Cuál es el antónimo de generoso?",
            opciones: [
                "Amable",
                "Solidario",
                "Egoísta"
            ],
            respuesta: 2,
            explicacion: "Egoísta expresa una actitud contraria a compartir."
        },

        {
            id: "len5",
            nivel: 3,
            titulo: "Personajes",
            pregunta: "¿Quién realiza las acciones principales de un cuento?",
            opciones: [
                "El personaje principal",
                "El título",
                "El escenario"
            ],
            respuesta: 0,
            explicacion: "El personaje principal participa en los acontecimientos centrales."
        },

        {
            id: "len6",
            nivel: 4,
            titulo: "Ortografía",
            pregunta: "¿Cuál oración está escrita correctamente?",
            opciones: [
                "Aver si mañana voy.",
                "A ver si mañana voy.",
                "Haber si mañana voy."
            ],
            respuesta: 1,
            explicacion: "A ver se utiliza para expresar expectativa. Haber es un verbo."
        }

    ],


    matematicas: [

        {
            id: "mat1",
            nivel: 1,
            titulo: "Sumas",
            pregunta: "¿Cuánto es 24 + 18?",
            opciones: ["32", "42", "44"],
            respuesta: 1,
            explicacion: "24 + 18 = 42."
        },

        {
            id: "mat2",
            nivel: 1,
            titulo: "Ley de signos",
            pregunta: "¿Cuánto es (-5) + 8?",
            opciones: ["-13", "-3", "3"],
            respuesta: 2,
            explicacion: "Los signos son diferentes. Restamos 8 - 5 = 3 y conservamos el signo positivo."
        },

        {
            id: "mat3",
            nivel: 2,
            titulo: "Fracciones",
            pregunta: "¿Cuánto es 1/2 + 1/4?",
            opciones: ["2/6", "3/4", "1/8"],
            respuesta: 1,
            explicacion: "Convertimos 1/2 en 2/4. Después sumamos 2/4 + 1/4 = 3/4."
        },

        {
            id: "mat4",
            nivel: 2,
            titulo: "Porcentajes",
            pregunta: "¿Cuánto es el 20% de 150?",
            opciones: ["15", "30", "45"],
            respuesta: 1,
            explicacion: "150 × 0.20 = 30."
        },

        {
            id: "mat5",
            nivel: 3,
            titulo: "Ecuaciones",
            pregunta: "Si x + 7 = 15, ¿cuánto vale x?",
            opciones: ["8", "22", "7"],
            respuesta: 0,
            explicacion: "Restamos 7 en ambos lados: x = 15 - 7 = 8."
        },

        {
            id: "mat6",
            nivel: 4,
            titulo: "Problemas cotidianos",
            pregunta: "Un cuaderno cuesta $18. ¿Cuánto cuestan 4?",
            opciones: ["$62", "$72", "$82"],
            respuesta: 1,
            explicacion: "Multiplicamos 18 × 4 = 72."
        }

    ]

};


const nombresNiveles = [
    "Principiante",
    "Intermedio",
    "Avanzado",
    "Experto"
];

let colorSeleccionado = "";

const obtener = (id) => document.getElementById(id);


/* ==========================================
   MENSAJES
========================================== */

let temporizador;

function mensaje(texto) {

    const toast = obtener("toast");

    toast.textContent = texto;

    toast.classList.add("show");

    clearTimeout(temporizador);

    temporizador = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);

}


/* ==========================================
   CAMBIAR DE SECCION
========================================== */

function abrirSeccion(nombre) {

    document.querySelectorAll(".seccion").forEach(seccion => {
        seccion.classList.remove("active");
    });

    document.querySelectorAll(".menu button").forEach(boton => {
        boton.classList.toggle(
            "active",
            boton.dataset.section === nombre
        );
    });

    const destino = obtener("seccion-" + nombre);

    if (destino) {
        destino.classList.add("active");
    }

    if (nombre === "avances" || nombre === "inicio") {
        cargarAvances();
    }

    if (nombre === "glosario") {
        cargarGlosario();
    }

}


document.querySelectorAll(".menu button").forEach(boton => {

    boton.addEventListener("click", () => {
        abrirSeccion(boton.dataset.section);
    });

});


document.querySelectorAll("[data-go]").forEach(boton => {

    boton.addEventListener("click", () => {
        abrirSeccion(boton.dataset.go);
    });

});


/* ==========================================
   MOSTRAR NIVELES
========================================== */

function mostrarNiveles(id, nivelDisponible) {

    const contenedor = obtener(id);

    contenedor.innerHTML = "";

    nombresNiveles.forEach((nombre, indice) => {

        const nivel = indice + 1;

        const elemento = document.createElement("div");

        elemento.className = "level-step";

        if (nivel <= nivelDisponible) {
            elemento.classList.add("unlocked");
        }

        elemento.textContent =
            (nivel <= nivelDisponible ? "🔓 " : "🔒 ")
            + "Nivel " + nivel;

        contenedor.appendChild(elemento);

    });

}


/* ==========================================
   CREAR ACTIVIDADES
========================================== */

function mostrarActividades(materia, contenedorId, nivelDisponible = 1) {

    const contenedor = obtener(contenedorId);

    contenedor.innerHTML = "";

    actividades[materia].forEach(actividad => {

        const tarjeta = document.createElement("article");

        tarjeta.className = "activity-card";

        const bloqueada = actividad.nivel > nivelDisponible;

        const opciones = actividad.opciones.map((opcion, indice) => {

            return `<option value="${indice}">${opcion}</option>`;

        }).join("");

        if (bloqueada) {

            tarjeta.innerHTML = `
                <span class="activity-tag">
                    Nivel ${actividad.nivel}
                </span>

                <h3>${actividad.titulo}</h3>

                <p>
                    🔒 Completa dos actividades de los
                    niveles anteriores para desbloquear este reto.
                </p>
            `;

            contenedor.appendChild(tarjeta);

            return;

        }

        tarjeta.innerHTML = `

            <span class="activity-tag">
                ${actividad.nivel} · ${nombresNiveles[actividad.nivel - 1]}
            </span>

            <h3>${actividad.titulo}</h3>

            <p>${actividad.pregunta}</p>

            <select aria-label="Selecciona tu respuesta">

                <option value="">
                    Elige una respuesta
                </option>

                ${opciones}

            </select>

            <button class="btn primary">
                Comprobar respuesta
            </button>

            <div class="feedback" aria-live="polite"></div>

        `;

        const seleccion = tarjeta.querySelector("select");

        const boton = tarjeta.querySelector("button");

        const resultado = tarjeta.querySelector(".feedback");


        boton.addEventListener("click", async () => {

            if (seleccion.value === "") {

                resultado.textContent =
                    "Selecciona una respuesta.";

                resultado.className = "feedback bad";

                return;

            }

            const correcta =
                Number(seleccion.value) === actividad.respuesta;

            resultado.className =
                "feedback " + (correcta ? "good" : "bad");

            resultado.innerHTML = `

                ${correcta
                    ? "¡Correcto! 🌟"
                    : "¡Sigue practicando!"}

                <div class="step-explanation">
                    ${actividad.explicacion}
                </div>

            `;

            boton.disabled = true;

            seleccion.disabled = true;

            try {

                await guardarRespuesta(
                    actividad.id,
                    materia,
                    correcta
                );

            } catch (error) {

                mensaje("No se pudo guardar la actividad.");

                boton.disabled = false;

                seleccion.disabled = false;

            }

        });

        contenedor.appendChild(tarjeta);

    });

}


/* ==========================================
   GUARDAR RESPUESTAS EN SQLITE
========================================== */

async function guardarRespuesta(
    actividad,
    materia,
    correcta
) {

    const respuesta = await fetch("/api/respuesta", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            actividad: actividad,

            materia: materia,

            correcta: correcta

        })

    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.mensaje || "Error al guardar");
    }

    if (datos.repetida) {

        mensaje("Esta actividad ya estaba registrada.");

    } else {

        mensaje(
            datos.mensaje + " +" + datos.puntos + " puntos"
        );

    }

    await cargarAvances();

    return datos;

}


/* ==========================================
   CONSULTAR AVANCES
========================================== */

async function cargarAvances() {

    try {

        const respuesta = await fetch("/api/avances");

        if (!respuesta.ok) {
            throw new Error("No se pudieron consultar los avances.");
        }

        const datos = await respuesta.json();


        // Estadisticas del inicio

        obtener("home-points").textContent =
            datos.puntos;

        obtener("home-completed").textContent =
            datos.completadas;

        obtener("home-levels").textContent =
            datos.nivel_lengua + datos.nivel_matematicas;


        // Estadisticas de avances

        obtener("progress-points").textContent =
            datos.puntos;

        obtener("progress-completed").textContent =
            datos.completadas;


        // Progreso de Lengua

        obtener("language-progress-text").textContent =
            datos.lengua + " actividades completadas";

        obtener("language-progress-level").textContent =
            "Nivel " + datos.nivel_lengua
            + " · " + nombresNiveles[datos.nivel_lengua - 1];


        // Progreso de Matematicas

        obtener("math-progress-text").textContent =
            datos.matematicas + " actividades completadas";

        obtener("math-progress-level").textContent =
            "Nivel " + datos.nivel_matematicas
            + " · " + nombresNiveles[datos.nivel_matematicas - 1];


        obtener("language-progress-bar").style.width =
            Math.min(100, datos.lengua / 6 * 100) + "%";

        obtener("math-progress-bar").style.width =
            Math.min(100, datos.matematicas / 6 * 100) + "%";


        // Actualizar actividades y niveles

        mostrarNiveles(
            "language-track",
            datos.nivel_lengua
        );

        mostrarNiveles(
            "math-track",
            datos.nivel_matematicas
        );

        mostrarActividades(
            "lengua",
            "language-activities",
            datos.nivel_lengua
        );

        mostrarActividades(
            "matematicas",
            "math-activities",
            datos.nivel_matematicas
        );


        // Historial

        const historial = obtener("history-list");

        historial.innerHTML = "";

        if (datos.historial.length === 0) {

            historial.innerHTML =
                "<p>Aún no tienes actividades realizadas.</p>";

        }

        datos.historial.forEach(actividad => {

            const fila = document.createElement("div");

            fila.className = "history-item";

            const icono =
                actividad.materia === "lengua"
                    ? "📚"
                    : actividad.materia === "matematicas"
                    ? "➗"
                    : "🎨";

            const nombre = document.createElement("span");

            nombre.textContent =
                icono + " " + actividad.actividad;

            const puntos = document.createElement("strong");

            puntos.textContent =
                "+" + actividad.puntos + " puntos";

            fila.append(nombre, puntos);

            historial.appendChild(fila);

        });

    } catch (error) {

        console.error("Error al cargar avances:", error);

    }

}


/* ==========================================
   GLOSARIO EDUCATIVO
========================================== */

async function cargarGlosario() {

    const busqueda = obtener("glossary-search").value;

    try {

        const respuesta = await fetch(
            "/api/glosario?buscar=" + encodeURIComponent(busqueda)
        );

        const palabras = await respuesta.json();

        const lista = obtener("glossary-list");

        lista.innerHTML = "";

        if (palabras.length === 0) {

            lista.textContent = "No se encontraron palabras.";

            return;

        }

        palabras.forEach(palabra => {

            const tarjeta = document.createElement("article");

            tarjeta.className = "word-card";

            const titulo = document.createElement("h3");

            titulo.textContent = palabra.palabra;

            const significado = document.createElement("p");

            significado.textContent = palabra.significado;

            const ejemplo = document.createElement("p");

            ejemplo.textContent = "Ejemplo: " + palabra.ejemplo;

            tarjeta.append(
                titulo,
                significado,
                ejemplo
            );

            lista.appendChild(tarjeta);

        });

    } catch (error) {

        mensaje("No se pudo cargar el glosario.");

    }

}


obtener("glossary-search").addEventListener(
    "input",
    cargarGlosario
);


/* ==========================================
   ARTE Y CREATIVIDAD
========================================== */

document.querySelectorAll(".color-choice").forEach(boton => {

    boton.addEventListener("click", () => {

        colorSeleccionado = boton.dataset.color;

        document.querySelectorAll(".color-choice").forEach(opcion => {

            opcion.classList.toggle(
                "selected",
                opcion === boton
            );

        });

        obtener("art-submit").disabled = false;

    });

});


obtener("art-submit").addEventListener("click", async () => {

    const correcta = colorSeleccionado === "Verde";

    const resultado = obtener("art-feedback");

    resultado.className =
        "feedback " + (correcta ? "good" : "bad");

    resultado.textContent = correcta
        ? "¡Muy bien! Azul y amarillo forman verde. 🎨"
        : "Inténtalo nuevamente. La respuesta es verde.";

    if (correcta) {

        obtener("art-submit").disabled = true;

        try {

            await guardarRespuesta(
                "arte-color1",
                "arte",
                true
            );

        } catch (error) {

            mensaje("No se pudo guardar tu resultado.");

        }

    }

});


/* ==========================================
   ACTIVIDAD DE EXPRESION ARTISTICA
========================================== */

obtener("creative-save").addEventListener("click", () => {

    const texto = obtener("creative-text").value.trim();

    const resultado = obtener("creative-feedback");

    if (texto.length < 10) {

        resultado.className = "feedback bad";

        resultado.textContent =
            "Escribe una idea un poco más extensa.";

        return;

    }

    resultado.className = "feedback good";

    resultado.textContent =
        "¡Excelente! Tu creatividad también forma parte del aprendizaje. 🎨";

});


/* ==========================================
   INICIAR PLATAFORMA
========================================== */

mostrarActividades(
    "lengua",
    "language-activities",
    1
);

mostrarActividades(
    "matematicas",
    "math-activities",
    1
);

mostrarNiveles("language-track", 1);

mostrarNiveles("math-track", 1);

cargarAvances();