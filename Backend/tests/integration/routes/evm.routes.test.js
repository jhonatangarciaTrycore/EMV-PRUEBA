import request from 'supertest';
import { app } from '../../../app.js';
import { db } from '../../../db.config.js';

jest.mock('../../../db.config.js', () => ({
    db: {
        query: jest.fn(),
    },
}));

describe('EVM Routes - Integration Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /evm/getActivityEvm/:id', () => {
        test('should return 200 with activity EVM data when activity exists', async () => {
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

            // Helper activityExistsById
            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });
            // Service getActivityEvm
            db.query.mockResolvedValueOnce({ rows: [mockActivity], rowCount: 1 });

            const res = await request(app).get('/evm/getActivityEvm/1');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('msg', 'EVM de actividad obtenido correctamente');
            expect(res.body).toHaveProperty('activity');
            expect(res.body.activity).toHaveProperty('evm');
            expect(res.body.activity.evm).toHaveProperty('cpi');
            expect(res.body.activity.evm).toHaveProperty('spi');
        });

        test('should return 400 when activity id is invalid', async () => {
            const res = await request(app).get('/evm/getActivityEvm/invalid');

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 400 when activity does not exist', async () => {
            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            const res = await request(app).get('/evm/getActivityEvm/999');

            expect(res.status).toBe(400);
        });

        test('should return 500 when database query fails', async () => {
            // Helper activityExistsById
            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });
            // Service getActivityEvm
            db.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).get('/evm/getActivityEvm/1');

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('msg');
        });

        test('should include all EVM metrics in response', async () => {
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

            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });
            db.query.mockResolvedValueOnce({ rows: [mockActivity], rowCount: 1 });

            const res = await request(app).get('/evm/getActivityEvm/1');

            const evm = res.body.activity.evm;
            expect(evm).toHaveProperty('pv');
            expect(evm).toHaveProperty('ev');
            expect(evm).toHaveProperty('ac');
            expect(evm).toHaveProperty('cv');
            expect(evm).toHaveProperty('sv');
            expect(evm).toHaveProperty('cpi');
            expect(evm).toHaveProperty('spi');
            expect(evm).toHaveProperty('eac');
            expect(evm).toHaveProperty('vac');
        });
    });

    describe('GET /evm/getProjectEvm/:projectId', () => {
        test('should return 200 with project EVM data when project has activities', async () => {
            const mockProject = {
                id: 1,
                nombre: 'Test Project',
            };

            const mockActivities = [
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

            // Helper projectExistsById
            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });
            // Helper projectHasActivities
            db.query.mockResolvedValueOnce({ rows: mockActivities, rowCount: 2 });
            // Service getProjectEvm
            db.query.mockResolvedValueOnce({ rows: [mockProject], rowCount: 1 });

            const res = await request(app).get('/evm/getProjectEvm/1');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('msg', 'EVM de proyecto obtenido correctamente');
            expect(res.body).toHaveProperty('project');
            expect(res.body).toHaveProperty('activities');
            expect(res.body).toHaveProperty('evm');
            expect(res.body.activities).toHaveLength(2);
        });

        test('should return 400 when project id is invalid', async () => {
            const res = await request(app).get('/evm/getProjectEvm/invalid');

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 400 when project does not exist', async () => {
            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            const res = await request(app).get('/evm/getProjectEvm/999');

            expect(res.status).toBe(400);
        });

        test('should return 400 when project has no activities', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });
            db.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

            const res = await request(app).get('/evm/getProjectEvm/1');

            expect(res.status).toBe(400);
        });

        test('should return 500 when database query fails', async () => {
            // Helper projectExistsById
            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });
            // Helper projectHasActivities
            db.query.mockResolvedValueOnce({ rows: [{ id: 1, project_id: 1 }], rowCount: 1 });
            // Service getProjectEvm
            db.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).get('/evm/getProjectEvm/1');

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('msg');
        });

        test('should include project EVM metrics in response', async () => {
            const mockProject = {
                id: 1,
                nombre: 'Test Project',
            };

            const mockActivities = [
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
            ];

            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });
            db.query.mockResolvedValueOnce({ rows: mockActivities, rowCount: 1 });
            db.query.mockResolvedValueOnce({ rows: [mockProject], rowCount: 1 });

            const res = await request(app).get('/evm/getProjectEvm/1');

            const evm = res.body.evm;
            expect(evm).toHaveProperty('bac');
            expect(evm).toHaveProperty('pv');
            expect(evm).toHaveProperty('ev');
            expect(evm).toHaveProperty('ac');
            expect(evm).toHaveProperty('cpi');
            expect(evm).toHaveProperty('spi');
        });

        test('should include all activities in response', async () => {
            const mockProject = {
                id: 1,
                nombre: 'Test Project',
            };

            const mockActivities = [
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

            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });
            db.query.mockResolvedValueOnce({ rows: mockActivities, rowCount: 2 });
            db.query.mockResolvedValueOnce({ rows: [mockProject], rowCount: 1 });

            const res = await request(app).get('/evm/getProjectEvm/1');

            expect(res.body.activities).toHaveLength(2);
            expect(res.body.activities[0]).toHaveProperty('evm');
            expect(res.body.activities[1]).toHaveProperty('evm');
        });
    });
});
