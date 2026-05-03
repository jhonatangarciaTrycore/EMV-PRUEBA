import { evmService } from '../../../services/evm.service.js';
import { db } from '../../../db.config.js';

jest.mock('../../../db.config.js', () => ({
    db: {
        query: jest.fn(),
    },
}));

describe('EVM Service - Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('calculateEvm - Core EVM Calculation Logic', () => {
        // Helper function to access calculateEvm (it's not exported, so we'll test through service methods)
        // We'll test the calculation through getActivityEvm and getProjectEvm

        test('should calculate EVM metrics correctly with valid data', async () => {
            const mockActivity = {
                id: 1,
                project_id: 1,
                nombre: 'Test Activity',
                bac: 1000,
                planned_percent: 50,
                actual_percent: 40,
                actual_cost: 350,
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockActivity], rowCount: 1 });

            const result = await evmService.getActivityEvm(1);

            expect(result.activity.evm).toBeDefined();
            expect(result.activity.evm.pv).toBe(500); // 1000 * 50 / 100
            expect(result.activity.evm.ev).toBe(400); // 1000 * 40 / 100
            expect(result.activity.evm.ac).toBe(350);
            expect(result.activity.evm.cv).toBe(50); // 400 - 350
            expect(result.activity.evm.sv).toBe(-100); // 400 - 500
        });

        test('should calculate CPI correctly when AC > 0', async () => {
            const mockActivity = {
                id: 1,
                project_id: 1,
                nombre: 'Test Activity',
                bac: 1000,
                planned_percent: 50,
                actual_percent: 40,
                actual_cost: 400,
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockActivity], rowCount: 1 });

            const result = await evmService.getActivityEvm(1);

            // CPI = EV / AC = 400 / 400 = 1
            expect(result.activity.evm.cpi.value).toBe(1);
            expect(result.activity.evm.cpi.interpretation).toBe('En presupuesto');
        });

        test('should return null CPI when AC is 0 (avoid division by zero)', async () => {
            const mockActivity = {
                id: 1,
                project_id: 1,
                nombre: 'Test Activity',
                bac: 1000,
                planned_percent: 50,
                actual_percent: 40,
                actual_cost: 0, // AC = 0
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockActivity], rowCount: 1 });

            const result = await evmService.getActivityEvm(1);

            expect(result.activity.evm.cpi.value).toBeNull();
            expect(result.activity.evm.cpi.interpretation).toBe('Sin datos');
        });

        test('should calculate SPI correctly when PV > 0', async () => {
            const mockActivity = {
                id: 1,
                project_id: 1,
                nombre: 'Test Activity',
                bac: 1000,
                planned_percent: 50, // PV = 500
                actual_percent: 60, // EV = 600
                actual_cost: 500,
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockActivity], rowCount: 1 });

            const result = await evmService.getActivityEvm(1);

            // SPI = EV / PV = 600 / 500 = 1.2
            expect(result.activity.evm.spi.value).toBe(1.2);
            expect(result.activity.evm.spi.interpretation).toBe('Adelantado');
        });

        test('should return null SPI when PV is 0 (avoid division by zero)', async () => {
            const mockActivity = {
                id: 1,
                project_id: 1,
                nombre: 'Test Activity',
                bac: 1000,
                planned_percent: 0, // PV = 0
                actual_percent: 40,
                actual_cost: 350,
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockActivity], rowCount: 1 });

            const result = await evmService.getActivityEvm(1);

            expect(result.activity.evm.spi.value).toBeNull();
            expect(result.activity.evm.spi.interpretation).toBe('Sin datos');
        });

        test('should interpret CPI < 1 as over budget', async () => {
            const mockActivity = {
                id: 1,
                project_id: 1,
                nombre: 'Test Activity',
                bac: 1000,
                planned_percent: 50,
                actual_percent: 40,
                actual_cost: 500, // AC > EV
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockActivity], rowCount: 1 });

            const result = await evmService.getActivityEvm(1);

            // CPI = 400 / 500 = 0.8
            expect(result.activity.evm.cpi.value).toBe(0.8);
            expect(result.activity.evm.cpi.interpretation).toBe('Por debajo del presupuesto');
        });

        test('should interpret CPI > 1 as under budget', async () => {
            const mockActivity = {
                id: 1,
                project_id: 1,
                nombre: 'Test Activity',
                bac: 1000,
                planned_percent: 50,
                actual_percent: 40,
                actual_cost: 300, // AC < EV
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockActivity], rowCount: 1 });

            const result = await evmService.getActivityEvm(1);

            // CPI = 400 / 300 = 1.33
            expect(result.activity.evm.cpi.value).toBeCloseTo(1.33, 1);
            expect(result.activity.evm.cpi.interpretation).toBe('Por encima del presupuesto');
        });

        test('should interpret SPI < 1 as behind schedule', async () => {
            const mockActivity = {
                id: 1,
                project_id: 1,
                nombre: 'Test Activity',
                bac: 1000,
                planned_percent: 60, // PV = 600
                actual_percent: 40, // EV = 400
                actual_cost: 350,
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockActivity], rowCount: 1 });

            const result = await evmService.getActivityEvm(1);

            // SPI = 400 / 600 = 0.67
            expect(result.activity.evm.spi.value).toBeCloseTo(0.67, 2);
            expect(result.activity.evm.spi.interpretation).toBe('Atrasado');
        });

        test('should interpret SPI = 1 as on time', async () => {
            const mockActivity = {
                id: 1,
                project_id: 1,
                nombre: 'Test Activity',
                bac: 1000,
                planned_percent: 50, // PV = 500
                actual_percent: 50, // EV = 500
                actual_cost: 400,
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockActivity], rowCount: 1 });

            const result = await evmService.getActivityEvm(1);

            expect(result.activity.evm.spi.value).toBe(1);
            expect(result.activity.evm.spi.interpretation).toBe('En tiempo');
        });

        test('should calculate EAC correctly', async () => {
            const mockActivity = {
                id: 1,
                project_id: 1,
                nombre: 'Test Activity',
                bac: 1000,
                planned_percent: 50,
                actual_percent: 40,
                actual_cost: 400,
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockActivity], rowCount: 1 });

            const result = await evmService.getActivityEvm(1);

            // CPI = 400 / 400 = 1
            // EAC = BAC / CPI = 1000 / 1 = 1000
            expect(result.activity.evm.eac).toBe(1000);
        });

        test('should calculate VAC correctly', async () => {
            const mockActivity = {
                id: 1,
                project_id: 1,
                nombre: 'Test Activity',
                bac: 1000,
                planned_percent: 50,
                actual_percent: 40,
                actual_cost: 400,
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockActivity], rowCount: 1 });

            const result = await evmService.getActivityEvm(1);

            // EAC = 1000, VAC = BAC - EAC = 1000 - 1000 = 0
            expect(result.activity.evm.vac).toBe(0);
        });

        test('should return null EAC when CPI is null', async () => {
            const mockActivity = {
                id: 1,
                project_id: 1,
                nombre: 'Test Activity',
                bac: 1000,
                planned_percent: 50,
                actual_percent: 40,
                actual_cost: 0, // AC = 0, CPI = null
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockActivity], rowCount: 1 });

            const result = await evmService.getActivityEvm(1);

            expect(result.activity.evm.eac).toBeNull();
            expect(result.activity.evm.vac).toBeNull();
        });

        test('should round values correctly', async () => {
            const mockActivity = {
                id: 1,
                project_id: 1,
                nombre: 'Test Activity',
                bac: 1000,
                planned_percent: 33.33,
                actual_percent: 25.5,
                actual_cost: 250.555,
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockActivity], rowCount: 1 });

            const result = await evmService.getActivityEvm(1);

            // PV should be rounded to 2 decimals
            expect(Number.isInteger(result.activity.evm.pv * 100)).toBe(true);
            // CPI and SPI should be rounded to 4 decimals
            expect(result.activity.evm.cpi.value).toEqual(
                expect.any(Number)
            );
        });

        test('should handle zero BAC (edge case)', async () => {
            const mockActivity = {
                id: 1,
                project_id: 1,
                nombre: 'Test Activity',
                bac: 0, // BAC = 0
                planned_percent: 50,
                actual_percent: 40,
                actual_cost: 0,
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockActivity], rowCount: 1 });

            const result = await evmService.getActivityEvm(1);

            expect(result.activity.evm.pv).toBe(0);
            expect(result.activity.evm.ev).toBe(0);
            expect(result.activity.evm.ac).toBe(0);
            // SPI and CPI will be null due to zero values
            expect(result.activity.evm.spi.value).toBeNull();
            expect(result.activity.evm.cpi.value).toBeNull();
        });
    });

    describe('getActivityEvm - Service Method', () => {
        test('should return activity with EVM metrics', async () => {
            const mockActivity = {
                id: 1,
                project_id: 1,
                nombre: 'Test Activity',
                bac: 1000,
                planned_percent: 50,
                actual_percent: 40,
                actual_cost: 350,
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockActivity], rowCount: 1 });

            const result = await evmService.getActivityEvm(1);

            expect(result).toHaveProperty('msg', 'EVM de actividad obtenido correctamente');
            expect(result).toHaveProperty('activity');
            expect(result.activity).toHaveProperty('evm');
            expect(result.activity.id).toBe(1);
        });

        test('should throw error when database query fails', async () => {
            db.query.mockRejectedValue(new Error('Database error'));

            await expect(evmService.getActivityEvm(1)).rejects.toThrow(
                'No se pudo obtener el EVM de la actividad'
            );
        });
    });

    describe('getProjectEvm - Service Method', () => {
        test('should calculate project EVM from multiple activities', async () => {
            const activities = [
                {
                    id: 1,
                    project_id: 1,
                    nombre: 'Activity 1',
                    bac: 1000,
                    planned_percent: 50,
                    actual_percent: 40,
                    actual_cost: 350,
                    created_at: '2026-05-02',
                    updated_at: '2026-05-02',
                },
                {
                    id: 2,
                    project_id: 1,
                    nombre: 'Activity 2',
                    bac: 1000,
                    planned_percent: 50,
                    actual_percent: 60,
                    actual_cost: 600,
                    created_at: '2026-05-02',
                    updated_at: '2026-05-02',
                },
            ];

            const mockProject = {
                id: 1,
                nombre: 'Test Project',
            };

            db.query.mockResolvedValue({ rows: [mockProject], rowCount: 1 });

            const result = await evmService.getProjectEvm(1, activities);

            expect(result).toHaveProperty('msg', 'EVM de proyecto obtenido correctamente');
            expect(result).toHaveProperty('project');
            expect(result).toHaveProperty('activities');
            expect(result).toHaveProperty('evm');
            expect(result.activities).toHaveLength(2);
            expect(result.evm.bac).toBe(2000); // Sum of BACs
        });

        test('should calculate project totals correctly', async () => {
            const activities = [
                {
                    id: 1,
                    project_id: 1,
                    nombre: 'Activity 1',
                    bac: 1000,
                    planned_percent: 50,
                    actual_percent: 50,
                    actual_cost: 500,
                    created_at: '2026-05-02',
                    updated_at: '2026-05-02',
                },
                {
                    id: 2,
                    project_id: 1,
                    nombre: 'Activity 2',
                    bac: 1000,
                    planned_percent: 50,
                    actual_percent: 50,
                    actual_cost: 500,
                    created_at: '2026-05-02',
                    updated_at: '2026-05-02',
                },
            ];

            const mockProject = {
                id: 1,
                nombre: 'Test Project',
            };

            db.query.mockResolvedValue({ rows: [mockProject], rowCount: 1 });

            const result = await evmService.getProjectEvm(1, activities);

            // PV = 500 + 500 = 1000
            // EV = 500 + 500 = 1000
            // AC = 500 + 500 = 1000
            expect(result.evm.pv).toBe(1000);
            expect(result.evm.ev).toBe(1000);
            expect(result.evm.ac).toBe(1000);
            expect(result.evm.cpi.value).toBe(1);
            expect(result.evm.spi.value).toBe(1);
        });

        test('should handle empty activities array', async () => {
            const activities = [];

            const mockProject = {
                id: 1,
                nombre: 'Test Project',
            };

            db.query.mockResolvedValue({ rows: [mockProject], rowCount: 1 });

            const result = await evmService.getProjectEvm(1, activities);

            expect(result.activities).toHaveLength(0);
            expect(result.evm.bac).toBe(0);
            expect(result.evm.pv).toBe(0);
            expect(result.evm.ev).toBe(0);
            expect(result.evm.ac).toBe(0);
        });

        test('should throw error when database query fails', async () => {
            const activities = [
                {
                    id: 1,
                    project_id: 1,
                    nombre: 'Activity 1',
                    bac: 1000,
                    planned_percent: 50,
                    actual_percent: 40,
                    actual_cost: 350,
                },
            ];

            db.query.mockRejectedValue(new Error('Database error'));

            await expect(evmService.getProjectEvm(1, activities)).rejects.toThrow(
                'No se pudo obtener el EVM del proyecto'
            );
        });

        test('should calculate project EVM metrics from aggregated activities', async () => {
            const activities = [
                {
                    id: 1,
                    project_id: 1,
                    nombre: 'Activity 1',
                    bac: 500,
                    planned_percent: 80,
                    actual_percent: 60,
                    actual_cost: 300,
                    created_at: '2026-05-02',
                    updated_at: '2026-05-02',
                },
                {
                    id: 2,
                    project_id: 1,
                    nombre: 'Activity 2',
                    bac: 500,
                    planned_percent: 20,
                    actual_percent: 20,
                    actual_cost: 100,
                    created_at: '2026-05-02',
                    updated_at: '2026-05-02',
                },
            ];

            const mockProject = {
                id: 1,
                nombre: 'Test Project',
            };

            db.query.mockResolvedValue({ rows: [mockProject], rowCount: 1 });

            const result = await evmService.getProjectEvm(1, activities);

            // Activity 1: PV=400, EV=300
            // Activity 2: PV=100, EV=100
            // Project totals: BAC=1000, PV=500, EV=400, AC=400
            expect(result.evm.bac).toBe(1000);
            expect(result.evm.pv).toBe(500);
            expect(result.evm.ev).toBe(400);
            expect(result.evm.ac).toBe(400);
        });
    });
});
