# CECyTO Vial PRO

Plataforma educativa de seguridad vial con navegación por secciones, búsqueda y filtros de infracciones, cuestionario interactivo y resultados.

## Requisitos
- Node.js instalado
- XAMPP con MySQL iniciado
- Visual Studio Code (recomendado)

## Instalación
1. Abre esta carpeta en VS Code.
2. Inicia MySQL desde XAMPP.
3. En phpMyAdmin, revisa si ya existe `cecyto_vial` y sus tablas.
4. Si la base ya existe, **no ejecutes `database/schema.sql` completo** sin revisar primero las tablas. Si empiezas desde cero, puedes importar ese archivo en phpMyAdmin.
5. Abre la terminal integrada en la carpeta raíz y ejecuta:
   `npm.cmd install`
6. Inicia el servidor:
   `npm.cmd start`
7. Abre `http://localhost:3000`.

## Configuración de MySQL
Valores predeterminados de `server.js`:
- Host: localhost
- Puerto: 3306
- Usuario: root
- Contraseña: vacía
- Base: cecyto_vial

Si tu instalación usa otros valores, define las variables de entorno `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME` antes de iniciar Node.

## Comprobación
- `http://localhost:3000/api/health`
- `http://localhost:3000/api/faltas`
- `http://localhost:3000/api/cuestionario`
- `http://localhost:3000/api/resultados`

## Estructura
- `server.js`: API Express y conexión MySQL.
- `public/`: interfaz web y JavaScript del navegador.
- `database/schema.sql`: esquema y datos iniciales de ejemplo.
- `diagramas/`: flujo y entidad-relación.
- `documentacion/`: wireframe y pantallas.

## Aviso
La aplicación es un prototipo educativo. Verifica las disposiciones, artículos y sanciones con fuentes oficiales vigentes antes de utilizarlos como asesoría normativa.
