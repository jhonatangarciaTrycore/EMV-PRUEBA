# Pruebas Automatizadas - EVM Backend

## Estructura de Pruebas

```
tests/
├── unit/
│   └── services/
│       ├── evm.service.test.js      (40+ tests)
│       ├── project.service.test.js  (25+ tests)
│       └── activity.service.test.js (25+ tests)
└── integration/
    └── routes/
        ├── evm.routes.test.js       (10+ tests)
        ├── project.routes.test.js   (20+ tests)
        └── activity.routes.test.js  (25+ tests)
```

## Stack de Testing

- **Jest**: Framework principal para testing
- **Supertest**: Testing de endpoints HTTP
- **Mock Database**: Mocking de db.query para pruebas aisladas

## Cobertura de Pruebas

### Pruebas Unitarias - EVM Service (40+ tests)

**calculateEvm - Lógica de Cálculo EVM:**
- ✅ Cálculo correcto de métricas PV, EV, AC, CV, SV
- ✅ Cálculo de CPI cuando AC > 0
- ✅ Manejo de división por cero cuando AC = 0 (retorna null)
- ✅ Cálculo de SPI cuando PV > 0
- ✅ Manejo de división por cero cuando PV = 0 (retorna null)
- ✅ Interpretación de CPI < 1 (Por debajo del presupuesto)
- ✅ Interpretación de CPI > 1 (Por encima del presupuesto)
- ✅ Interpretación de CPI = 1 (En presupuesto)
- ✅ Interpretación de SPI < 1 (Atrasado)
- ✅ Interpretación de SPI > 1 (Adelantado)
- ✅ Interpretación de SPI = 1 (En tiempo)
- ✅ Cálculo de EAC (Estimate at Completion)
- ✅ Cálculo de VAC (Variance at Completion)
- ✅ Redondeo correcto a 2 decimales (PV, EV, AC) y 4 decimales (CPI, SPI)
- ✅ Manejo de BAC = 0 (caso edge)

**getActivityEvm:**
- ✅ Retorna actividad con métricas EVM correctas
- ✅ Maneja errores de base de datos

**getProjectEvm:**
- ✅ Calcula EVM de proyecto desde múltiples actividades
- ✅ Calcula totales correctamente (BAC, PV, EV, AC)
- ✅ Maneja array vacío de actividades
- ✅ Calcula métricas consolidadas del proyecto
- ✅ Maneja errores de base de datos

### Pruebas Unitarias - Project Service (25+ tests)

**createProject:**
- ✅ Crea proyecto exitosamente
- ✅ Maneja errores de base de datos
- ✅ Maneja nombre vacío

**getProjects:**
- ✅ Retorna todos los proyectos sin término de búsqueda
- ✅ Filtra proyectos por término de búsqueda (case-insensitive)
- ✅ Retorna array vacío cuando no hay coincidencias
- ✅ Maneja errores de base de datos

**getProjectById:**
- ✅ Retorna proyecto por ID
- ✅ Retorna null cuando no existe
- ✅ Maneja errores de base de datos

**updateProject:**
- ✅ Actualiza proyecto exitosamente
- ✅ Actualiza timestamp
- ✅ Retorna null cuando no existe
- ✅ Maneja errores de base de datos

**deleteProject:**
- ✅ Elimina proyecto exitosamente
- ✅ Maneja errores de base de datos

### Pruebas Unitarias - Activity Service (25+ tests)

Similar a Project Service, cubriendo:
- ✅ CRUD completo con validaciones
- ✅ Búsqueda con filtros (case-insensitive)
- ✅ Manejo de edge cases (BAC = 0, etc.)
- ✅ Errores de base de datos

### Pruebas de Integración - EVM Routes (10+ tests)

**GET /evm/getActivityEvm/:id**
- ✅ Retorna 200 con datos de EVM de actividad
- ✅ Retorna 400 cuando ID es inválido
- ✅ Retorna 404 cuando actividad no existe
- ✅ Retorna 500 cuando falla DB
- ✅ Incluye todas las métricas EVM en respuesta

**GET /evm/getProjectEvm/:projectId**
- ✅ Retorna 200 con datos de EVM de proyecto
- ✅ Retorna 400 cuando ID es inválido
- ✅ Retorna 404 cuando proyecto no existe o no tiene actividades
- ✅ Retorna 500 cuando falla DB
- ✅ Incluye métricas consolidadas y actividades

### Pruebas de Integración - Project Routes (20+ tests)

**POST /projects/saveProject**
- ✅ Crea proyecto (201)
- ✅ Valida nombre requerido (400)
- ✅ Valida largo máximo de nombre (400)
- ✅ Trim whitespace
- ✅ Maneja errores DB (500)

**GET /projects/getProjects**
- ✅ Retorna todos los proyectos (200)
- ✅ Filtra por query parameter ?search=
- ✅ Retorna array vacío cuando no hay coincidencias
- ✅ Maneja errores DB (500)

**GET /projects/getProject/:id**
- ✅ Retorna proyecto por ID (200)
- ✅ Valida ID (400)
- ✅ Retorna 404 cuando no existe
- ✅ Maneja errores DB (500)

**PUT /projects/updateProject/:id**
- ✅ Actualiza proyecto (200)
- ✅ Valida ID (400)
- ✅ Valida nombre requerido (400)
- ✅ Retorna 404 cuando no existe
- ✅ Maneja errores DB (500)

**DELETE /projects/deleteProject/:id**
- ✅ Elimina proyecto (200)
- ✅ Valida ID (400)
- ✅ Retorna 404 cuando no existe
- ✅ Maneja errores DB (500)

### Pruebas de Integración - Activity Routes (25+ tests)

**POST /activities/saveActivity/:projectId**
- ✅ Crea actividad (201)
- ✅ Valida projectId (400)
- ✅ Valida campos requeridos (400)
- ✅ Valida BAC >= 0 (400)
- ✅ Valida planned_percent 0-100 (400)
- ✅ Valida actual_percent 0-100 (400)
- ✅ Retorna 404 cuando proyecto no existe
- ✅ Maneja errores DB (500)

**GET /activities/getActivities/:projectId**
- ✅ Retorna actividades por proyecto (200)
- ✅ Filtra por query parameter ?search=
- ✅ Valida projectId (400)
- ✅ Retorna 404 cuando proyecto no existe
- ✅ Retorna array vacío cuando no hay actividades
- ✅ Maneja errores DB (500)

**GET /activities/getActivity/:id**
- ✅ Retorna actividad por ID (200)
- ✅ Valida ID (400)
- ✅ Retorna 404 cuando no existe
- ✅ Maneja errores DB (500)

**PUT /activities/updateActivity/:id**
- ✅ Actualiza actividad (200)
- ✅ Valida ID (400)
- ✅ Retorna 404 cuando no existe
- ✅ Maneja errores DB (500)

**DELETE /activities/deleteActivity/:id**
- ✅ Elimina actividad (200)
- ✅ Valida ID (400)
- ✅ Retorna 404 cuando no existe
- ✅ Maneja errores DB (500)

## Casos Críticos Cubiertos

### EVM Calculations (Lo más importante)
- ✅ AC = 0 (no división por cero)
- ✅ PV = 0 (no división por cero)
- ✅ BAC = 0 (valores cero)
- ✅ Valores negativos (validación)
- ✅ Porcentajes fuera de rango (validación)
- ✅ Redondeo correcto de decimales
- ✅ Interpretaciones de CPI/SPI correctas

### Data Validation
- ✅ Campos requeridos
- ✅ Rangos de valores (0-100 para porcentajes)
- ✅ Tipos de datos correctos
- ✅ Largo máximo de strings

### Error Handling
- ✅ Validación de IDs (positivos, enteros)
- ✅ Registros no encontrados
- ✅ Errores de base de datos
- ✅ Respuestas HTTP correctas (201, 200, 400, 404, 500)

## Cómo Ejecutar los Tests

### Instalar dependencias
```bash
npm install
```

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests en modo watch (desarrollo)
```bash
npm run test:watch
```

### Generar reporte de cobertura
```bash
npm run test:coverage
```

## Estructura de un Test Unitario

```javascript
describe('Service Name', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Method Name', () => {
        test('should do something specific', async () => {
            // Arrange - preparar datos
            const payload = { /* ... */ };
            db.query.mockResolvedValue({ /* ... */ });

            // Act - ejecutar
            const result = await service.method(payload);

            // Assert - verificar
            expect(result).toHaveProperty('msg');
            expect(result.data).toBeDefined();
        });
    });
});
```

## Estructura de un Test de Integración

```javascript
describe('GET /endpoint', () => {
    test('should return 200 with correct structure', async () => {
        // Mock database
        db.query.mockResolvedValue({ /* ... */ });

        // Make request
        const res = await request(app).get('/endpoint');

        // Verify status and response
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('msg');
        expect(res.body).toHaveProperty('data');
    });
});
```

## Notas Importantes

1. **No se testean Controllers directamente**: Los controllers solo delegan al service, así que se testean vía integración.

2. **DB Mocking**: Todos los tests mockean `db.query()` para evitar dependencias de una base de datos real.

3. **Jest Cleanup**: Después de cada test, se limpian los mocks con `jest.clearAllMocks()`.

4. **Cobertura Total**: Los tests cubren:
   - Happy path (casos exitosos)
   - Error cases (errores esperados)
   - Edge cases (valores limite)
   - Validation (restricciones de entrada)
   - HTTP Status codes (respuestas correctas)

## Próximos Pasos (Opcional)

- Agregar tests e2e con una BD de test real
- Agregar tests de performance
- Agregar tests de seguridad (inyección SQL, XSS, etc.)
- Integración con CI/CD (GitHub Actions)
- Reporte de cobertura automático
