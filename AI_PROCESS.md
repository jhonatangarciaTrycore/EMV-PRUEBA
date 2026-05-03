## AI Process

## Herramientas de IA utilizadas y por que

- GitHub Copilot Chat (GPT-5.3-Codex): herramienta principal para implementar backend/frontend, generar pruebas automatizadas, documentacion tecnica y apoyar debugging rapido dentro de VS Code.
- IA de apoyo conversacional en la misma sesion: se uso para iterar prompts, validar redaccion tecnica y acelerar decisiones durante correcciones de pruebas.

La eleccion fue por integracion directa con el editor, velocidad para iterar cambios en codigo real y capacidad para combinar analisis + edicion + ejecucion de comandos.

-ChatGpt : se uso para la creacion de prompts, para generar archivos de contexto para backend y frontend. 


## Prompts utilizados (textuales y en orden cronologico)

- [2026-05-02] Teniendo ya contexto del proyecto, genera la estructura de carpetas y genera los modelos.
- [2026-05-02] Instala dependecias e inicializa el server
- [2026-05-02] crea un script para ejecutar el schema.sql
- [2026-05-02] sube los cambios al repositorio.
- [2026-05-02] empecemos haciendo el crud de proyectos.
- [2026-05-02] no hagas la logica de guardar por aparte hazla en el services.
- [2026-05-02] Crea la coleccion en postman con los enpoints completos.
- [2026-05-02] sigamos creando el crud de actividades.
- [2026-05-02] crea los endpoints en postman.
- [2026-05-02] sube los cambios en una nueva rama.
- [2026-05-02] ahora, implementa el calculo de evm.
- [2026-05-02] crea los endpoints en postman.
- [2026-05-02] sube los cambios a una nueva rama.
- [2026-05-02] Sube los cambios a una rama de release/*.
- [2026-05-02] Empecemos haciendo la vista para los proyectos, usa los componentes, realiza el script segun los estipulado.
- [2026-05-02] sube los cambios a una rama nueva.
- [2026-05-02] Empecemos haciendo la vista para los proyectos, usa los componentes, realiza el script segun lo estipulado.
- [2026-05-02] para los btn de la table, hay un componente llamado buttostable
- [2026-05-02] Cambia esto por un modal.
- [2026-05-02] ahora, agrega un btn a la tabla de proyectos para ver el detalle de proyectos en una vista. donde, se van a ver las actividades relacionadas y los valor del emv.
- [2026-05-02] usa el componente q-chip para dar visivilidad a los status de cpi y spi del proyecto y de las actividades.
- [2026-05-02] ahora, agrega en el detalle un btn para agregar activdades.
- [2026-05-02] ahora, necesito agregar una gráfica que compare PV, EV y AC por actividad. usa chart
- [2026-05-02] agrega, que cuando pase el mouse por cada columna me salga el status de cpi y spi de esa actividad.
- [2026-05-02] ya estan todas la funcionalidades requeridas. Ahora, mejora el diseño de todo.
- [2026-05-02] ahora, revisa el layout, cambia la informacion
- [2026-05-02] Agrega una seccion en el detalle de proyecto, que si no tiene actividades no se muestre la grafica ni el contenedor para la info del proyecto y se muestre diciendo que para mostrarlos hay que agregar actividades.
- [2026-05-02] ahora, sube los cambios del frontend.
- [2026-05-02] para el frontend en una nueva rama.
- [2026-05-02] ahora crea filtros de busqueda para los proyectos y filtros de busqueda para las actividades en el backend. por query
- [2026-05-02] agrega los filtros en el frontend, usa los inputs con debonce.
- [2026-05-02] sube los cambios.
- [2026-05-02] Analiza el proyecto backend actual (Node.js + Express) y genera pruebas automatizadas siguiendo buenas prácticas.
- [2026-05-02] Objetivo:
Crear tests unitarios y de integración que cubran la lógica de negocio y los endpoints del sistema, especialmente la lógica de cálculo EVM.

Instrucciones:

1. Detectar automáticamente:

   * Estructura del proyecto (controllers, services, routes)
   * Servicios relacionados con EVM (ej: EvmService o similares)
   * Endpoints definidos en routes

2. Generar pruebas unitarias para:

   * Todos los métodos de services que contienen lógica de negocio
   * Especialmente cálculos EVM (CPI, SPI, EV, AC, PV, etc.)

3. Cubrir obligatoriamente casos borde:

   * AC = 0 (evitar división por cero)
   * Datos vacíos o null
   * Actividades inexistentes
   * Avance real = 0
   * Valores inconsistentes

4. Generar pruebas de integración para endpoints:

   * Al menos un test por endpoint
   * Validar:

     * Código de estado HTTP
     * Estructura de la respuesta (JSON)
     * Mensajes esperados

5. Stack de testing:

   * Usar Jest como framework principal
   * Usar Supertest para endpoints HTTP
   * Mockear base de datos cuando sea necesario

6. Buenas prácticas:

   * No testear controllers directamente si solo delegan
   * Testear services de forma aislada
   * Usar mocks para dependencias externas (DB)
   * Tests claros y descriptivos

7. Estructura esperada:

tests/
├── unit/
│   └── services/
│       └── evm.service.test.js
└── integration/
└── routes/
└── project.routes.test.js

8. Formato de los tests:

   * Usar describe / it
   * Nombres descriptivos:
     "should calculate CPI correctly when AC > 0"
     "should handle division by zero when AC is 0"

9. No inventar lógica:

   * Basarse únicamente en el código existente
   * Usar nombres reales de funciones del proyecto

Resultado esperado:
Código listo para ejecutar con Jest, sin pseudocódigo, completamente funcional y alineado con el proyecto actual.
- [2026-05-02] ejecuta las pruebas.
- [2026-05-02] sube los cambios
- [2026-05-03] a una rama nueva
- [2026-05-03] ahora crea el README.md para el backend.
- [2026-05-03] pon de donde se saca la conexion para la base de datos.
- [2026-05-03] ahora crea el README.md para el frontend
- [2026-05-03] sube los cambios


## Como aprendi EVM y como valide antes de implementarlo

Use gemeni para entender los conceptos de EVM, como se calculan las metricas y que significan. Luego, valide los calculos con ejemplos practicos y casos borde para asegurarme que la logica era correcta antes de implementarla en el codigo.

Tambien use NotebookLM para aprender EVM y validar los calculos con ejemplos adicionales. 

## Dos decisiones donde no segui la sugerencia inicial de la IA
- La IA sugirio crear archivos para realizar consultas SQL, pero decidi usar consultas SQL directas con pg en el service para mantenerlo simple y transparente.

- La IA sugurios codigo de frontend desalineado con lo propuesto, por ejemplo, uso de componentes que no existian, rutas distintas a las propuestas, etc. Decidi escribir mas detalles en el contexto para el frontend. 


## Decision de arquitectura tomada de forma independiente

Separacion por capas en backend:

- Routes: validaciones y definicion HTTP.
- Controllers: orquestacion request/response.
- Services: logica de negocio y consultas.
- Helpers: validadores de existencia/restricciones reutilizables.

Esta estructura se mantuvo consistente durante CRUD, EVM y pruebas.


## Reflexion honesta: que haria diferente

- Empezaria por especificar mas a detalle los requerimientos para realizar archivos de contexto mas completos para cada parte. Para que la IA tenga toda la informacion y genere codigo mas alineado desde el inicio. 