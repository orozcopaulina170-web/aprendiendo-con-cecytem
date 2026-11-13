# ==========================================
# MISION CEREBRITO
# Servidor con Flask y base de datos SQLite
# ==========================================

import os
import sqlite3

from functools import wraps
from flask import (
    Flask, render_template, request,
    redirect, url_for, session, flash,
    jsonify
)

from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

# Configuracion principal
app = Flask(__name__)

app.secret_key = os.environ.get(
    "SECRET_KEY",
    "mision-cerebrito-clave-escolar"
)

# Ruta de la base de datos
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.path.join(BASE_DIR, "mision_cerebrito.db")


# ==========================================
# CONEXION CON SQLITE
# ==========================================

def conectar():
    conexion = sqlite3.connect(DATABASE)
    conexion.row_factory = sqlite3.Row
    return conexion


# ==========================================
# CREAR LAS TABLAS
# ==========================================

def crear_base_datos():

    conexion = conectar()

    conexion.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            usuario TEXT NOT NULL UNIQUE COLLATE NOCASE,
            contrasena TEXT NOT NULL,
            grado TEXT NOT NULL
        )
    """)

    conexion.execute("""
        CREATE TABLE IF NOT EXISTS avances (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            actividad TEXT NOT NULL,
            materia TEXT NOT NULL,
            puntos INTEGER NOT NULL,
            correcta INTEGER NOT NULL,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            UNIQUE(usuario_id, actividad),

            FOREIGN KEY(usuario_id)
            REFERENCES usuarios(id)
        )
    """)

    conexion.commit()
    conexion.close()


# ==========================================
# PROTEGER PAGINAS
# ==========================================

def requiere_sesion(funcion):

    @wraps(funcion)
    def verificar(*args, **kwargs):

        if "usuario_id" not in session:
            return redirect(url_for("inicio"))

        return funcion(*args, **kwargs)

    return verificar


# ==========================================
# PAGINA DE BIENVENIDA
# ==========================================

@app.route("/")
def inicio():

    if "usuario_id" in session:
        return redirect(url_for("panel"))

    return render_template("index.html")


# ==========================================
# REGISTRO DE ESTUDIANTES
# ==========================================

@app.route("/registro", methods=["POST"])
def registro():

    nombre = request.form.get("nombre", "").strip()
    usuario = request.form.get("usuario", "").strip()
    contrasena = request.form.get("contrasena", "")
    grado = request.form.get("grado", "").strip()

    if not all([nombre, usuario, contrasena, grado]):
        flash("Completa todos los campos.", "error")
        return redirect(url_for("inicio"))

    if len(usuario) < 3 or len(contrasena) < 6:
        flash(
            "El usuario necesita 3 caracteres y "
            "la contraseña al menos 6.",
            "error"
        )
        return redirect(url_for("inicio"))

    contrasena_segura = generate_password_hash(contrasena)

    conexion = conectar()

    try:

        conexion.execute("""
            INSERT INTO usuarios
            (nombre, usuario, contrasena, grado)
            VALUES (?, ?, ?, ?)
        """, (
            nombre,
            usuario,
            contrasena_segura,
            grado
        ))

        conexion.commit()

        flash(
            "¡Cuenta creada correctamente! "
            "Ya puedes iniciar sesión.",
            "success"
        )

    except sqlite3.IntegrityError:

        flash(
            "Ese nombre de usuario ya existe.",
            "error"
        )

    finally:
        conexion.close()

    return redirect(url_for("inicio"))


# ==========================================
# INICIO DE SESION
# ==========================================

@app.route("/login", methods=["POST"])
def login():

    usuario = request.form.get("usuario", "").strip()
    contrasena = request.form.get("contrasena", "")

    conexion = conectar()

    estudiante = conexion.execute("""
        SELECT * FROM usuarios
        WHERE usuario = ?
    """, (usuario,)).fetchone()

    conexion.close()

    if estudiante and check_password_hash(
        estudiante["contrasena"],
        contrasena
    ):

        session.clear()

        session["usuario_id"] = estudiante["id"]
        session["nombre"] = estudiante["nombre"]

        return redirect(url_for("panel"))

    flash(
        "Usuario o contraseña incorrectos.",
        "error"
    )

    return redirect(url_for("inicio"))


# ==========================================
# PANEL PRINCIPAL
# ==========================================

@app.route("/panel")
@requiere_sesion
def panel():

    return render_template(
        "dashboard.html",
        nombre=session["nombre"]
    )


# ==========================================
# CERRAR SESION
# ==========================================

@app.route("/cerrar_sesion")
def cerrar_sesion():

    session.clear()

    return redirect(url_for("inicio"))


# ==========================================
# GUARDAR RESULTADOS
# ==========================================

@app.route("/api/respuesta", methods=["POST"])
@requiere_sesion
def guardar_respuesta():

    datos = request.get_json(silent=True) or {}

    actividad = str(
        datos.get("actividad", "")
    ).strip()

    materia = str(
        datos.get("materia", "")
    ).strip()

    correcta = bool(datos.get("correcta", False))

    if not actividad or materia not in [
        "lengua", "matematicas", "arte"
    ]:
        return jsonify({
            "ok": False,
            "mensaje": "Datos incorrectos."
        }), 400

    puntos = 10 if correcta else 2

    conexion = conectar()

    existente = conexion.execute("""
        SELECT id FROM avances
        WHERE usuario_id = ?
        AND actividad = ?
    """, (
        session["usuario_id"],
        actividad
    )).fetchone()

    if existente:

        conexion.close()

        return jsonify({
            "ok": True,
            "repetida": True,
            "mensaje": "Esta actividad ya estaba registrada."
        })

    conexion.execute("""
        INSERT INTO avances
        (usuario_id, actividad, materia, puntos, correcta)
        VALUES (?, ?, ?, ?, ?)
    """, (
        session["usuario_id"],
        actividad,
        materia,
        puntos,
        int(correcta)
    ))

    conexion.commit()
    conexion.close()

    return jsonify({
        "ok": True,
        "puntos": puntos,
        "mensaje": "¡Tu avance se guardó correctamente!"
    })


# ==========================================
# CONSULTAR AVANCES
# ==========================================

@app.route("/api/avances")
@requiere_sesion
def consultar_avances():

    conexion = conectar()

    resultados = conexion.execute("""
        SELECT actividad, materia, puntos, correcta, fecha
        FROM avances
        WHERE usuario_id = ?
        ORDER BY fecha DESC
    """, (
        session["usuario_id"],
    )).fetchall()

    conexion.close()

    lista = [dict(fila) for fila in resultados]

    puntos = sum(
        fila["puntos"] for fila in lista
    )

    lengua = sum(
        1 for fila in lista
        if fila["materia"] == "lengua"
    )

    matematicas = sum(
        1 for fila in lista
        if fila["materia"] == "matematicas"
    )

    return jsonify({

        "nombre": session["nombre"],

        "puntos": puntos,

        "completadas": len(lista),

        "lengua": lengua,

        "matematicas": matematicas,

        "nivel_lengua": min(4, 1 + lengua // 2),

        "nivel_matematicas": min(
            4, 1 + matematicas // 2
        ),

        "historial": lista
    })


# ==========================================
# GLOSARIO EDUCATIVO
# ==========================================

@app.route("/api/glosario")
@requiere_sesion
def glosario():

    palabras = [

        {
            "palabra": "Metáfora",
            "significado": "Figura literaria que relaciona dos elementos por semejanza.",
            "ejemplo": "Tus ojos son dos luceros."
        },

        {
            "palabra": "Sinónimo",
            "significado": "Palabra que tiene un significado parecido a otra.",
            "ejemplo": "Feliz es sinónimo de alegre."
        },

        {
            "palabra": "Antónimo",
            "significado": "Palabra que expresa lo contrario de otra.",
            "ejemplo": "Frío es antónimo de caliente."
        },

        {
            "palabra": "Narrador",
            "significado": "Voz que cuenta los acontecimientos de una historia.",
            "ejemplo": "El narrador cuenta las aventuras."
        },

        {
            "palabra": "Fracción",
            "significado": "Representación de una parte de un todo.",
            "ejemplo": "Un medio se escribe 1/2."
        },

        {
            "palabra": "Porcentaje",
            "significado": "Cantidad expresada de cada cien.",
            "ejemplo": "50% representa la mitad."
        },

        {
            "palabra": "Ecuación",
            "significado": "Igualdad matemática con una incógnita.",
            "ejemplo": "x + 5 = 10."
        },

        {
            "palabra": "Variable",
            "significado": "Símbolo que representa un valor.",
            "ejemplo": "En 2x = 8, x es una variable."
        }

    ]

    busqueda = request.args.get(
        "buscar", ""
    ).lower()

    if busqueda:

        palabras = [
            palabra for palabra in palabras
            if busqueda in palabra["palabra"].lower()
            or busqueda in palabra["significado"].lower()
        ]

    return jsonify(palabras)


# ==========================================
# EJECUTAR SERVIDOR
# ==========================================

if __name__ == "__main__":

    crear_base_datos()

    app.run(debug=True)