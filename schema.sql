-- CECyTO Vial PRO
-- IMPORTANTE: antes de ejecutar este script, revisa si ya existe la base de datos.
-- Si ya la creaste en phpMyAdmin, no ejecutes todo de nuevo sin revisar las tablas.
CREATE DATABASE IF NOT EXISTS cecyto_vial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cecyto_vial;

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(160) NULL,
  rol VARCHAR(30) NOT NULL DEFAULT 'alumno',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faltas_viales (
  id_falta INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(160) NOT NULL,
  categoria VARCHAR(80) NOT NULL DEFAULT 'General',
  descripcion TEXT NOT NULL,
  recomendacion TEXT NULL,
  fundamento VARCHAR(255) NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reglamento (
  id_reglamento INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(180) NOT NULL,
  articulo VARCHAR(80) NULL,
  contenido TEXT NOT NULL,
  categoria VARCHAR(80) NULL
);

CREATE TABLE IF NOT EXISTS cuestionarios (
  id_cuestionario INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(180) NOT NULL,
  descripcion TEXT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS preguntas (
  id_pregunta INT AUTO_INCREMENT PRIMARY KEY,
  id_cuestionario INT NOT NULL,
  enunciado TEXT NOT NULL,
  opcion_a VARCHAR(255) NOT NULL,
  opcion_b VARCHAR(255) NOT NULL,
  opcion_c VARCHAR(255) NOT NULL,
  opcion_d VARCHAR(255) NOT NULL,
  respuesta_correcta CHAR(1) NOT NULL,
  explicacion TEXT NULL,
  CONSTRAINT fk_pregunta_cuestionario FOREIGN KEY (id_cuestionario)
    REFERENCES cuestionarios(id_cuestionario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resultados (
  id_resultado INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NULL,
  id_cuestionario INT NOT NULL,
  aciertos INT NOT NULL,
  total_preguntas INT NOT NULL,
  porcentaje DECIMAL(5,2) NOT NULL,
  fecha_resultado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_resultado_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
  CONSTRAINT fk_resultado_cuestionario FOREIGN KEY (id_cuestionario)
    REFERENCES cuestionarios(id_cuestionario)
);

INSERT INTO cuestionarios (titulo, descripcion)
SELECT 'Práctica de seguridad vial', 'Cuestionario educativo de prevención vial.'
WHERE NOT EXISTS (SELECT 1 FROM cuestionarios WHERE titulo = 'Práctica de seguridad vial');

INSERT INTO faltas_viales (nombre,categoria,descripcion,recomendacion,fundamento)
SELECT * FROM (
 SELECT 'No respetar el semáforo','Señalización','Ignorar una luz roja puede causar colisiones.','Detente ante la luz roja.','Consulta el reglamento oficial vigente.'
 UNION ALL SELECT 'Usar el teléfono al conducir','Conducta','Manipular el teléfono desvía la atención.','Detente en un lugar seguro antes de usarlo.','Consulta la normativa vigente.'
 UNION ALL SELECT 'No usar cinturón de seguridad','Seguridad','No usar cinturón aumenta el riesgo de lesiones.','Colócate el cinturón antes de iniciar el viaje.','Consulta las disposiciones vigentes.'
 UNION ALL SELECT 'Velocidad inadecuada','Conducta','La velocidad excesiva reduce el tiempo de reacción.','Respeta los límites y las condiciones del camino.','Consulta el reglamento oficial.'
 UNION ALL SELECT 'Estacionarse en lugar prohibido','Señalización','Puede obstruir circulación y accesos.','Busca un espacio autorizado.','Consulta las disposiciones municipales y estatales.'
 UNION ALL SELECT 'Documentación no vigente','Documentación','La documentación debe cumplir los requisitos vigentes.','Verifica los documentos antes de circular.','Consulta los requisitos oficiales.'
 UNION ALL SELECT 'No ceder el paso al peatón','Seguridad','No permitir un cruce seguro puede causar lesiones.','Reduce la velocidad y cede el paso cuando corresponda.','Consulta las normas de prioridad peatonal.'
 UNION ALL SELECT 'Conducir después de consumir alcohol','Seguridad','El alcohol afecta reflejos y decisiones.','Si consumes alcohol, no conduzcas.','Consulta la normativa vigente.'
) AS nuevos
WHERE NOT EXISTS (SELECT 1 FROM faltas_viales);

INSERT INTO preguntas (id_cuestionario,enunciado,opcion_a,opcion_b,opcion_c,opcion_d,respuesta_correcta,explicacion)
SELECT q.id_cuestionario, x.enunciado, x.a, x.b, x.c, x.d, x.correcta, x.explicacion
FROM cuestionarios q
JOIN (
 SELECT '¿Qué debes hacer ante una luz roja del semáforo?' enunciado,'Acelerar para pasar rápido' a,'Detenerte y respetar la señal' b,'Tocar el claxon y continuar' c,'Cambiar de carril' d,'b' correcta,'La luz roja indica detenerse.' explicacion
 UNION ALL SELECT '¿Qué debes revisar antes de iniciar un viaje?','Que el vehículo esté en condiciones seguras','El teléfono mientras avanzas','Ignorar los espejos','Conducir sin cinturón','a','Una revisión básica ayuda a detectar riesgos.'
 UNION ALL SELECT '¿Qué debes hacer si consumiste alcohol?','Conducir despacio','Tomar café y conducir','No conducir y elegir una alternativa segura','Abrir las ventanas','c','El café no elimina los efectos del alcohol.'
 UNION ALL SELECT '¿Qué debes hacer si necesitas usar el teléfono?','Leer mensajes al conducir','Sostenerlo con una mano','Grabar videos breves','Detenerte en un lugar seguro','d','Apartar la atención del camino aumenta el riesgo.'
 UNION ALL SELECT '¿Qué debes hacer ante un cruce peatonal?','Acelerar','Reducir la velocidad y permitir el paso cuando corresponda','Usar el claxon para apurar a las personas','No observar los lados','b','Protege a los peatones y respeta la prioridad aplicable.'
 UNION ALL SELECT '¿Para qué sirve el cinturón de seguridad?','Evitar todas las multas','Aumentar la velocidad','Reducir el riesgo de lesiones','Sustituir las bolsas de aire','c','Ayuda a mantener a los ocupantes en su lugar.'
 UNION ALL SELECT '¿Qué debes hacer si llueve intensamente?','Aumentar la velocidad','Frenar bruscamente en todo momento','Seguir muy cerca','Reducir la velocidad y aumentar la distancia','d','La lluvia reduce visibilidad y adherencia.'
 UNION ALL SELECT '¿Qué debes hacer ante una señal de alto?','Detenerte y continuar cuando sea seguro','Continuar sin observar','Tocar el claxon','Acelerar antes del cruce','a','Obedece la señal y continúa solo cuando sea seguro.'
 UNION ALL SELECT '¿Por qué respetar los límites de velocidad?','Para llegar primero','Para reducir riesgos y tener más tiempo de reacción','Para no usar espejos','Para no revisar el vehículo','b','La velocidad adecuada ayuda a mantener el control.'
 UNION ALL SELECT '¿Qué hacer si estás demasiado cansado?','Subir la música','Acelerar para llegar pronto','Detenerte en un lugar seguro y descansar','Continuar con los ojos entrecerrados','c','La fatiga disminuye la atención y los reflejos.'
) x
WHERE q.titulo='Práctica de seguridad vial'
AND NOT EXISTS (SELECT 1 FROM preguntas p WHERE p.id_cuestionario=q.id_cuestionario);
