# Frontend - EMV PRUEBA

Aplicacion frontend para gestion de proyectos y actividades con visualizacion de metricas EVM.

## Tecnologias

- Vue 3
- Vite
- Quasar
- Vue Router
- Axios
- Chart.js + vue-chartjs

## Requisitos

- Node.js 18 o superior
- Backend levantado (API de este proyecto)

## Instalacion

Desde la carpeta Frontend:

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

## Build de produccion

```bash
npm run build
```

## Previsualizar build

```bash
npm run preview
```

## Scripts disponibles

```json
{
	"dev": "vite",
	"build": "vite build",
	"preview": "vite preview"
}
```

## Conexion con el backend

La URL base del backend esta definida en:

- src/plugins/pluginAxios.js

Valor actual:

```js
baseURL: 'http://localhost:5000'
```

Si tu backend corre en otro puerto o dominio, cambia ese valor en ese archivo.

## Estructura principal

```text
Frontend/
	src/
		main.js
		App.vue
		routes/
			Routes.js
		views/
			projects.vue
			project-detail.vue
		services/
			apiclient.js
		plugins/
			pluginAxios.js
		components/
		layouts/
		composables/
```

## Rutas de la aplicacion

Router configurado con historial hash:

- / -> redirige a /app/projects
- /app/projects -> listado de proyectos
- /app/projects/:id -> detalle de proyecto, actividades, KPIs EVM y grafica PV/EV/AC

## Funcionalidades implementadas

- CRUD de proyectos
- CRUD de actividades por proyecto
- Busqueda de proyectos con debounce
- Busqueda de actividades en detalle de proyecto
- Calculo y visualizacion de metricas EVM
- Grafica comparativa PV vs EV vs AC por actividad
- Chips de estado para CPI y SPI
- Estado vacio cuando un proyecto no tiene actividades

## Integracion esperada de API

El frontend consume endpoints de:

- /projects
- /activities
- /evm

Ejemplos usados por las vistas:

- GET /projects/getProjects
- POST /projects/saveProject
- PUT /projects/updateProject/:id
- DELETE /projects/deleteProject/:id
- GET /evm/getProjectEvm/:projectId
- POST /activities/saveActivity/:projectId

## Notas

- Quasar se inicializa en src/main.js junto al plugin Notify.
- El cliente HTTP centralizado esta en src/services/apiclient.js.
- Si hay error de conexion, revisa primero el baseURL de Axios y que el backend este en ejecucion.
