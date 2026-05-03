# Backend - EMV PRUEBA

API REST para gestionar proyectos y actividades, y calcular metricas EVM (Earned Value Management).

## Tecnologias

- Node.js
- Express
- PostgreSQL
- express-validator
- Jest + Supertest

## Estructura

```text
Backend/
  app.js
  db.config.js
  controllers/
  routes/
  services/
  helpers/
  middlewares/
  database/
    schema.sql
    run-schema.js
  tests/
```

## Requisitos

- Node.js 18+
- PostgreSQL accesible por URL de conexion

## Variables de entorno

Crea un archivo `.env` en `Backend/` con:

```env
PORT=3000
DATABASE_URL=postgres://USUARIO:CLAVE@HOST:PUERTO/DB
```

Notas:
- `PORT` es opcional (por defecto `3000`).
- La conexion de `pg` usa SSL con `rejectUnauthorized: false`.

### De donde sale `DATABASE_URL`

La API toma la conexion desde `process.env.DATABASE_URL` en `db.config.js`.

Opciones comunes para obtenerla:

- PostgreSQL local:
  - Construye la URL con tus datos locales.
  - Ejemplo: `postgres://postgres:123456@localhost:5432/emv_prueba`

- Supabase:
  - Ve a `Project Settings > Database > Connection string`.
  - Copia la cadena URI (normalmente en formato `postgres://...`).

- Render / Railway / Neon / otros proveedores:
  - Busca la variable o campo `DATABASE_URL` en el panel del servicio.
  - Copia la cadena completa y pegala en tu `.env`.

Importante:
- No compartas `DATABASE_URL` en commits ni en chats.
- Verifica que la base exista y que el usuario tenga permisos de lectura/escritura.

## Instalacion

Desde `Backend/`:

```bash
npm install
```

## Inicializar base de datos

Aplica el schema:

```bash
npm run db
```

Este script ejecuta `database/schema.sql` y crea:

- `projects`
- `activities`

Con relacion:
- `activities.project_id` -> `projects.id` (ON DELETE CASCADE)

## Ejecutar servidor

Produccion/local:

```bash
npm start
```

Desarrollo (watch):

```bash
npm run dev
```

Base URL por defecto:

```text
http://localhost:5000
```

## Endpoints

### Proyectos (`/projects`)

- `POST /saveProject`
- `GET /getProjects`
  - Query opcional: `?search=texto`
- `GET /getProject/:id`
- `PUT /updateProject/:id`
- `DELETE /deleteProject/:id`

### Actividades (`/activities`)

- `POST /saveActivity/:projectId`
- `GET /getActivities/:projectId`
  - Query opcional: `?search=texto`
- `GET /getActivity/:id`
- `PUT /updateActivity/:id`
- `DELETE /deleteActivity/:id`

### EVM (`/evm`)

- `GET /getActivityEvm/:id`
- `GET /getProjectEvm/:projectId`

## Validaciones principales

- IDs deben ser enteros positivos.
- `nombre` es obligatorio y maximo 150 caracteres.
- `bac >= 0`
- `planned_percent` entre `0` y `100`
- `actual_percent` entre `0` y `100`
- `actual_cost >= 0`

## Scripts disponibles

```json
{
  "start": "node app.js",
  "dev": "node --watch app.js",
  "db": "node database/run-schema.js",
  "test": "jest --detectOpenHandles --forceExit",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

## Pruebas

Ejecutar todas:

```bash
npm test
```

Modo watch:

```bash
npm run test:watch
```

Cobertura:

```bash
npm run test:coverage
```

Las pruebas incluyen:

- Unitarias de servicios (`project`, `activity`, `evm`)
- Integracion de rutas (`projects`, `activities`, `evm`)

## Formato general de respuesta

Ejemplo exitoso:

```json
{
  "msg": "Operacion realizada correctamente",
  "data": {}
}
```

En este proyecto, segun endpoint, la propiedad puede ser `project`, `projects`, `activity`, `activities`, `evm` o `errors`.

## Notas de ejecucion

- En entorno `test`, `app.js` no levanta listener ni prueba conexion DB automaticamente.
- Fuera de `test`, la API intenta conectar a DB al iniciar y luego escucha en el puerto configurado.
