import request from 'supertest';
import { app } from '../../../app.js';
import { db } from '../../../db.config.js';

jest.mock('../../../db.config.js', () => ({
    db: {
        query: jest.fn(),
    },
}));

describe('Activity Routes - Integration Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /activities/saveActivity/:projectId', () => {
        test('should create activity and return 201', async () => {
            const projectId = 1;
            const payload = {
                nombre: 'New Activity',
                bac: 1000,
                planned_percent: 50,
                actual_percent: 40,
                actual_cost: 350,
            };

            const mockActivity = {
                id: 1,
                project_id: projectId,
                ...payload,
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            // Mock for projectExistsById
            db.query.mockResolvedValueOnce({ rows: [{ id: projectId }], rowCount: 1 });
            // Mock for createActivity
            db.query.mockResolvedValueOnce({ rows: [mockActivity], rowCount: 1 });

            const res = await request(app)
                .post(`/activities/saveActivity/${projectId}`)
                .send(payload);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('msg', 'Actividad creada correctamente');
            expect(res.body).toHaveProperty('activity');
            expect(res.body.activity.nombre).toBe('New Activity');
        });

        test('should return 400 when projectId is invalid', async () => {
            const payload = {
                nombre: 'New Activity',
                bac: 1000,
                planned_percent: 50,
                actual_percent: 40,
                actual_cost: 350,
            };

            const res = await request(app)
                .post('/activities/saveActivity/invalid')
                .send(payload);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 400 when required fields are missing', async () => {
            const projectId = 1;

            db.query.mockResolvedValue({ rows: [{ id: projectId }], rowCount: 1 });

            const res = await request(app)
                .post(`/activities/saveActivity/${projectId}`)
                .send({ nombre: 'New Activity' }); // missing other fields

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 400 when BAC is negative', async () => {
            const projectId = 1;
            const payload = {
                nombre: 'New Activity',
                bac: -100, // negative BAC
                planned_percent: 50,
                actual_percent: 40,
                actual_cost: 350,
            };

            db.query.mockResolvedValue({ rows: [{ id: projectId }], rowCount: 1 });

            const res = await request(app)
                .post(`/activities/saveActivity/${projectId}`)
                .send(payload);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 400 when planned_percent is out of range', async () => {
            const projectId = 1;
            const payload = {
                nombre: 'New Activity',
                bac: 1000,
                planned_percent: 150, // exceeds 100
                actual_percent: 40,
                actual_cost: 350,
            };

            db.query.mockResolvedValue({ rows: [{ id: projectId }], rowCount: 1 });

            const res = await request(app)
                .post(`/activities/saveActivity/${projectId}`)
                .send(payload);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 400 when actual_percent is out of range', async () => {
            const projectId = 1;
            const payload = {
                nombre: 'New Activity',
                bac: 1000,
                planned_percent: 50,
                actual_percent: -10, // negative
                actual_cost: 350,
            };

            db.query.mockResolvedValue({ rows: [{ id: projectId }], rowCount: 1 });

            const res = await request(app)
                .post(`/activities/saveActivity/${projectId}`)
                .send(payload);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 400 when project does not exist', async () => {
            const projectId = 999;
            const payload = {
                nombre: 'New Activity',
                bac: 1000,
                planned_percent: 50,
                actual_percent: 40,
                actual_cost: 350,
            };

            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            const res = await request(app)
                .post(`/activities/saveActivity/${projectId}`)
                .send(payload);

            expect(res.status).toBe(400);
        });

        test('should return 500 when database insert fails', async () => {
            const projectId = 1;
            const payload = {
                nombre: 'New Activity',
                bac: 1000,
                planned_percent: 50,
                actual_percent: 40,
                actual_cost: 350,
            };

            db.query.mockResolvedValueOnce({ rows: [{ id: projectId }], rowCount: 1 });
            db.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app)
                .post(`/activities/saveActivity/${projectId}`)
                .send(payload);

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('msg');
        });
    });

    describe('GET /activities/getActivities/:projectId', () => {
        test('should return activities for project with 200', async () => {
            const projectId = 1;
            const mockActivities = [
                {
                    id: 1,
                    project_id: projectId,
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
                    project_id: projectId,
                    nombre: 'Activity 2',
                    bac: 1000,
                    planned_percent: 50,
                    actual_percent: 60,
                    actual_cost: 600,
                    created_at: '2026-05-02',
                    updated_at: '2026-05-02',
                },
            ];

            db.query.mockResolvedValueOnce({ rows: [{ id: projectId }], rowCount: 1 });
            db.query.mockResolvedValueOnce({
                rows: mockActivities,
                rowCount: 2,
            });

            const res = await request(app).get(`/activities/getActivities/${projectId}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('msg', 'Actividades obtenidas correctamente');
            expect(res.body).toHaveProperty('activities');
            expect(res.body.activities).toHaveLength(2);
        });

        test('should filter activities by search query parameter', async () => {
            const projectId = 1;
            const mockActivities = [
                {
                    id: 1,
                    project_id: projectId,
                    nombre: 'Test Activity',
                    bac: 1000,
                    planned_percent: 50,
                    actual_percent: 40,
                    actual_cost: 350,
                    created_at: '2026-05-02',
                    updated_at: '2026-05-02',
                },
            ];

            db.query.mockResolvedValueOnce({ rows: [{ id: projectId }], rowCount: 1 });
            db.query.mockResolvedValueOnce({
                rows: mockActivities,
                rowCount: 1,
            });

            const res = await request(app).get(
                `/activities/getActivities/${projectId}?search=Test`
            );

            expect(res.status).toBe(200);
            expect(res.body.activities).toHaveLength(1);
        });

        test('should return 400 when projectId is invalid', async () => {
            const res = await request(app).get('/activities/getActivities/invalid');

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 400 when project does not exist', async () => {
            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            const res = await request(app).get('/activities/getActivities/999');

            expect(res.status).toBe(400);
        });

        test('should return empty array when project has no activities', async () => {
            const projectId = 1;

            db.query.mockResolvedValueOnce({ rows: [{ id: projectId }], rowCount: 1 });
            db.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

            const res = await request(app).get(`/activities/getActivities/${projectId}`);

            expect(res.status).toBe(200);
            expect(res.body.activities).toEqual([]);
        });

        test('should return 500 when database query fails', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });
            db.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).get('/activities/getActivities/1');

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('msg');
        });
    });

    describe('GET /activities/getActivity/:id', () => {
        test('should return activity by id with 200', async () => {
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
            // Service getActivityById
            db.query.mockResolvedValueOnce({ rows: [mockActivity], rowCount: 1 });

            const res = await request(app).get('/activities/getActivity/1');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('msg', 'Actividad obtenida correctamente');
            expect(res.body).toHaveProperty('activity');
            expect(res.body.activity.id).toBe(1);
        });

        test('should return 400 when id is invalid', async () => {
            const res = await request(app).get('/activities/getActivity/invalid');

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 400 when activity does not exist', async () => {
            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            const res = await request(app).get('/activities/getActivity/999');

            expect(res.status).toBe(400);
        });

        test('should return 500 when database query fails', async () => {
            // Helper activityExistsById
            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });
            // Service getActivityById
            db.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).get('/activities/getActivity/1');

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('msg');
        });
    });

    describe('PUT /activities/updateActivity/:id', () => {
        test('should update activity and return 200', async () => {
            const activityId = 1;
            const payload = {
                nombre: 'Updated Activity',
                bac: 1200,
                planned_percent: 60,
                actual_percent: 50,
                actual_cost: 600,
            };

            const mockActivity = {
                id: activityId,
                project_id: 1,
                ...payload,
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValueOnce({ rows: [{ id: activityId }], rowCount: 1 });
            db.query.mockResolvedValueOnce({ rows: [mockActivity], rowCount: 1 });

            const res = await request(app)
                .put(`/activities/updateActivity/${activityId}`)
                .send(payload);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('msg', 'Actividad actualizada correctamente');
            expect(res.body.activity.nombre).toBe('Updated Activity');
        });

        test('should return 400 when id is invalid', async () => {
            const payload = {
                nombre: 'Updated Activity',
                bac: 1200,
                planned_percent: 60,
                actual_percent: 50,
                actual_cost: 600,
            };

            const res = await request(app)
                .put('/activities/updateActivity/invalid')
                .send(payload);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 400 when activity does not exist', async () => {
            const payload = {
                nombre: 'Updated Activity',
                bac: 1200,
                planned_percent: 60,
                actual_percent: 50,
                actual_cost: 600,
            };

            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            const res = await request(app)
                .put('/activities/updateActivity/999')
                .send(payload);

            expect(res.status).toBe(400);
        });

        test('should return 500 when database query fails', async () => {
            const payload = {
                nombre: 'Updated Activity',
                bac: 1200,
                planned_percent: 60,
                actual_percent: 50,
                actual_cost: 600,
            };

            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });
            db.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app)
                .put('/activities/updateActivity/1')
                .send(payload);

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('msg');
        });
    });

    describe('DELETE /activities/deleteActivity/:id', () => {
        test('should delete activity and return 200', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });
            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });

            const res = await request(app).delete('/activities/deleteActivity/1');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('msg', 'Actividad eliminada correctamente');
        });

        test('should return 400 when id is invalid', async () => {
            const res = await request(app).delete('/activities/deleteActivity/invalid');

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 400 when activity does not exist', async () => {
            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            const res = await request(app).delete('/activities/deleteActivity/999');

            expect(res.status).toBe(400);
        });

        test('should return 500 when database query fails', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });
            db.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).delete('/activities/deleteActivity/1');

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('msg');
        });
    });
});
