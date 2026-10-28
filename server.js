const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cecyto_vial",
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4"
});

const demoFaults = [
  {id_falta:1,nombre:"No respetar el semáforo",categoria:"Señalización",descripcion:"Ignorar una luz roja puede causar colisiones y poner en riesgo a peatones y conductores.",recomendacion:"Detente ante la luz roja y continúa únicamente cuando la señal lo permita y sea seguro.",fundamento:"Verifica el artículo aplicable en el reglamento oficial vigente."},
  {id_falta:2,nombre:"Usar el teléfono al conducir",categoria:"Conducta",descripcion:"Manipular el teléfono desvía la atención del camino y aumenta el riesgo de un siniestro.",recomendacion:"Configura tu ruta antes de salir. Si necesitas usar el teléfono, detente en un lugar seguro.",fundamento:"Consulta la normativa vigente sobre conducción y distracciones."},
  {id_falta:3,nombre:"No usar cinturón de seguridad",categoria:"Seguridad",descripcion:"Viajar sin cinturón aumenta el riesgo de lesiones durante una frenada brusca o colisión.",recomendacion:"Colócate el cinturón antes de iniciar el recorrido y verifica que los pasajeros también lo usen.",fundamento:"Consulta las disposiciones vigentes de seguridad vehicular."},
  {id_falta:4,nombre:"Velocidad inadecuada",categoria:"Conducta",descripcion:"Circular demasiado rápido para el límite o las condiciones del camino reduce el tiempo de reacción.",recomendacion:"Respeta los límites y adapta la velocidad al clima, tránsito y visibilidad.",fundamento:"Verifica los límites y sanciones en el reglamento vigente."},
  {id_falta:5,nombre:"Estacionarse en lugar prohibido",categoria:"Señalización",descripcion:"Puede obstruir la circulación, rampas, cruces peatonales o accesos de emergencia.",recomendacion:"Busca un espacio autorizado y revisa los señalamientos antes de estacionarte.",fundamento:"Consulta las disposiciones municipales y estatales aplicables."},
  {id_falta:6,nombre:"Documentación no vigente",categoria:"Documentación",descripcion:"No contar con los documentos exigidos puede generar problemas durante una revisión vial.",recomendacion:"Verifica la vigencia de la licencia y los documentos requeridos para tu vehículo.",fundamento:"Consulta los requisitos oficiales vigentes."},
  {id_falta:7,nombre:"No ceder el paso al peatón",categoria:"Seguridad",descripcion:"No permitir un cruce seguro puede ocasionar lesiones graves.",recomendacion:"Reduce la velocidad en los cruces y cede el paso cuando corresponda.",fundamento:"Consulta las normas vigentes de prioridad peatonal."},
  {id_falta:8,nombre:"Conducir después de consumir alcohol",categoria:"Seguridad",descripcion:"El alcohol afecta los reflejos, la coordinación y la capacidad de tomar decisiones.",recomendacion:"Si consumes alcohol, no conduzcas. Elige un conductor sobrio o transporte alternativo.",fundamento:"Consulta la normativa vigente sobre conducción bajo efectos del alcohol."},
  {id_falta:9,nombre:"No mantener distancia segura",categoria:"Seguridad",descripcion:"Circular demasiado cerca de otro vehículo reduce el tiempo disponible para reaccionar.",recomendacion:"Deja suficiente espacio y aumenta la distancia con lluvia o poca visibilidad.",fundamento:"Consulta las disposiciones vigentes de circulación segura."},
  {id_falta:10,nombre:"No respetar señales de alto",categoria:"Señalización",descripcion:"Ignorar una señal de alto pone en riesgo a todos los usuarios del cruce.",recomendacion:"Detente por completo, observa y continúa solo cuando sea seguro.",fundamento:"Consulta el reglamento oficial aplicable."},
  {id_falta:11,nombre:"Conducir con fatiga",categoria:"Conducta",descripcion:"El cansancio disminuye la atención y puede provocar microsueños.",recomendacion:"Descansa en un sitio seguro antes de continuar el viaje.",fundamento:"Recomendación preventiva de seguridad vial."},
  {id_falta:12,nombre:"No revisar el vehículo",categoria:"Seguridad",descripcion:"Neumáticos, luces o frenos en mal estado pueden contribuir a un siniestro.",recomendacion:"Realiza revisiones preventivas y atiende cualquier falla antes de circular.",fundamento:"Recomendación preventiva; consulta las obligaciones oficiales vigentes."}
];

const demoQuestions = [
  {id_pregunta:1,enunciado:"¿Qué debes hacer ante una luz roja del semáforo?",opcion_a:"Acelerar para pasar rápido",opcion_b:"Detenerte y respetar la señal",opcion_c:"Tocar el claxon y continuar",opcion_d:"Cambiar de carril",respuesta_correcta:"b",explicacion:"La luz roja indica detenerse, respetando las condiciones de seguridad."},
  {id_pregunta:2,enunciado:"¿Qué debes hacer antes de iniciar un viaje?",opcion_a:"Revisar que el vehículo esté en condiciones seguras",opcion_b:"Usar el teléfono mientras avanzas",opcion_c:"Ignorar los espejos",opcion_d:"Conducir sin cinturón",respuesta_correcta:"a",explicacion:"Una revisión básica ayuda a detectar riesgos antes de circular."},
  {id_pregunta:3,enunciado:"¿Cuál es la mejor decisión si consumiste alcohol?",opcion_a:"Conducir despacio",opcion_b:"Tomar café y conducir",opcion_c:"No conducir y elegir una alternativa segura",opcion_d:"Abrir las ventanas",respuesta_correcta:"c",explicacion:"El café y las ventanas abiertas no eliminan los efectos del alcohol."},
  {id_pregunta:4,enunciado:"¿Cómo debes usar el teléfono mientras conduces?",opcion_a:"Leer mensajes en cada semáforo",opcion_b:"Sostenerlo con una mano",opcion_c:"Grabar videos breves",opcion_d:"Evitar manipularlo y detenerte en un lugar seguro si es necesario",respuesta_correcta:"d",explicacion:"Apartar la atención del camino aumenta el riesgo de un siniestro."},
  {id_pregunta:5,enunciado:"¿Qué debes hacer al acercarte a un cruce peatonal?",opcion_a:"Acelerar",opcion_b:"Reducir la velocidad y permitir el paso cuando corresponda",opcion_c:"Usar el claxon para que las personas se retiren",opcion_d:"No observar los lados",respuesta_correcta:"b",explicacion:"Debes proteger a los peatones y respetar la prioridad aplicable."},
  {id_pregunta:6,enunciado:"¿Para qué sirve el cinturón de seguridad?",opcion_a:"Para evitar todas las multas",opcion_b:"Para aumentar la velocidad",opcion_c:"Para reducir el riesgo de lesiones",opcion_d:"Para sustituir las bolsas de aire",respuesta_correcta:"c",explicacion:"El cinturón ayuda a mantener a los ocupantes en su lugar."},
  {id_pregunta:7,enunciado:"¿Qué debes hacer si llueve intensamente?",opcion_a:"Aumentar la velocidad",opcion_b:"Frenar bruscamente en todo momento",opcion_c:"Seguir muy cerca al vehículo de adelante",opcion_d:"Reducir la velocidad y aumentar la distancia",respuesta_correcta:"d",explicacion:"La lluvia reduce la visibilidad y puede disminuir la adherencia."},
  {id_pregunta:8,enunciado:"¿Qué debes hacer ante una señal de alto?",opcion_a:"Detenerte y continuar cuando sea seguro",opcion_b:"Continuar sin observar",opcion_c:"Tocar el claxon",opcion_d:"Acelerar antes del cruce",respuesta_correcta:"a",explicacion:"Debes obedecer la señal y comprobar que puedes continuar con seguridad."},
  {id_pregunta:9,enunciado:"¿Por qué debes respetar los límites de velocidad?",opcion_a:"Para llegar primero",opcion_b:"Para reducir riesgos y tener más tiempo de reacción",opcion_c:"Para no usar espejos",opcion_d:"Para no revisar el vehículo",respuesta_correcta:"b",explicacion:"La velocidad adecuada ayuda a mantener el control del vehículo."},
  {id_pregunta:10,enunciado:"¿Qué debes hacer si estás demasiado cansado para conducir?",opcion_a:"Subir la música",opcion_b:"Acelerar para llegar pronto",opcion_c:"Detenerte en un lugar seguro y descansar",opcion_d:"Continuar con los ojos entrecerrados",respuesta_correcta:"c",explicacion:"La fatiga disminuye la atención y los reflejos."}
];

async function queryOrFallback(sql, params, fallback) {
  try {
    const [rows] = await pool.query(sql, params || []);
    return rows;
  } catch (error) {
    console.warn("Consulta de base de datos no disponible; se usan datos de demostración:", error.message);
    return fallback;
  }
}

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({servidor:"activo",baseDeDatos:"conectada",modo:"mysql"});
  } catch (error) {
    res.status(503).json({servidor:"activo",baseDeDatos:"sin conexión",detalle:error.message});
  }
});

app.get("/api/faltas", async (req, res) => {
  const rows = await queryOrFallback(
    "SELECT * FROM faltas_viales ORDER BY id_falta",
    [],
    demoFaults
  );
  res.json(rows.length ? rows : demoFaults);
});

app.get("/api/cuestionario", async (req, res) => {
  try {
    const [quizzes] = await pool.query("SELECT * FROM cuestionarios ORDER BY id_cuestionario LIMIT 1");
    if (!quizzes.length) return res.json({cuestionario:{id_cuestionario:1,titulo:"Práctica de seguridad vial"},preguntas:demoQuestions});
    const id = quizzes[0].id_cuestionario;
    const [questions] = await pool.query(
      "SELECT * FROM preguntas WHERE id_cuestionario = ? ORDER BY id_pregunta",
      [id]
    );
    if (!questions.length) return res.json({cuestionario:quizzes[0],preguntas:demoQuestions});
    res.json({cuestionario:quizzes[0],preguntas:questions});
  } catch (error) {
    res.json({cuestionario:{id_cuestionario:1,titulo:"Práctica de seguridad vial"},preguntas:demoQuestions,modo:"demostracion"});
  }
});

app.post("/api/resultados", async (req, res) => {
  const aciertos = Number(req.body.aciertos);
  const total = Number(req.body.total_preguntas);
  const quizId = Number(req.body.id_cuestionario || 1);
  if (!Number.isInteger(aciertos) || !Number.isInteger(total) || total < 1 || aciertos < 0 || aciertos > total) {
    return res.status(400).json({error:"El resultado enviado no es válido."});
  }
  const porcentaje = Math.round(aciertos / total * 100);
  try {
    const [result] = await pool.query(
      "INSERT INTO resultados (id_cuestionario, aciertos, total_preguntas, porcentaje) VALUES (?, ?, ?, ?)",
      [quizId, aciertos, total, porcentaje]
    );
    return res.status(201).json({mensaje:"Resultado guardado",id_resultado:result.insertId,porcentaje});
  } catch (error) {
    return res.status(503).json({error:"No se pudo guardar en MySQL. Revisa las columnas de resultados.",detalle:error.message,porcentaje});
  }
});

app.get("/api/resultados", async (req, res) => {
  const rows = await queryOrFallback(
    "SELECT r.*, c.titulo FROM resultados r LEFT JOIN cuestionarios c ON c.id_cuestionario = r.id_cuestionario ORDER BY r.id_resultado DESC LIMIT 50",
    [],
    []
  );
  res.json(rows);
});

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, () => {
  console.log(`\nCECyTO Vial PRO está disponible en http://localhost:${PORT}`);
  console.log("Si MySQL no está listo, las secciones educativas usan datos de demostración.\n");
});
