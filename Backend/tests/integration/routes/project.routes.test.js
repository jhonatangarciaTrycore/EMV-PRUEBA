import request from 'supertest';
import { app } from '../../../app.js';
import { db } from '../../../db.config.js';

jest.mock('../../../db.config.js', () => ({
    db: {
        query: jest.fn(),
    },
}));

describe('Project Routes - Integration Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /projects/saveProject', () => {
        test('should create project and return 201', async () => {
            const payload = { nombre: 'New Project' };
            const mockProject = {
                id: 1,
                nombre: 'New Project',
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockProject], rowCount: 1 });

            const res = await request(app).post('/projects/saveProject').send(payload);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('msg', 'Proyecto creado correctamente');
            expect(res.body).toHaveProperty('project');
            expect(res.body.project.nombre).toBe('New Project');
        });

        test('should return 400 when nombre is missing', async () => {
            const res = await request(app).post('/projects/saveProject').send({});

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 400 when nombre exceeds max length', async () => {
            const payload = {
                nombre: 'a'.repeat(151), // exceeds 150 chars
            };

            const res = await request(app)
                .post('/projects/saveProject')
                .send(payload);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 500 when database insert fails', async () => {
            const payload = { nombre: 'New Project' };

            db.query.mockRejectedValue(new Error('Database error'));

            const res = await request(app).post('/projects/saveProject').send(payload);

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('msg');
        });

        test('should trim whitespace from nombre', async () => {
            const payload = { nombre: '  New Project  ' };
            const mockProject = {
                id: 1,
                nombre: 'New Project',
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockProject], rowCount: 1 });

            const res = await request(app).post('/projects/saveProject').send(payload);

            expect(res.status).toBe(201);
        });
    });

    describe('GET /projects/getProjects', () => {
        test('should return all projects with 200', async () => {
            const mockProjects = [
                {
                    id: 1,
                    nombre: 'Project 1',
                    created_at: '2026-05-02',
                    updated_at: '2026-05-02',
                },
                {
                    id: 2,
                    nombre: 'Project 2',
                    created_at: '2026-05-02',
                    updated_at: '2026-05-02',
                },
            ];

            db.query.mockResolvedValue({ rows: mockProjects, rowCount: 2 });

            const res = await request(app).get('/projects/getProjects');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('msg', 'Proyectos obtenidos correctamente');
            expect(res.body).toHaveProperty('projects');
            expect(res.body.projects).toHaveLength(2);
        });

        test('should filter projects by search query parameter', async () => {
            const mockProjects = [
                {
                    id: 1,
                    nombre: 'Test Project',
                    created_at: '2026-05-02',
                    updated_at: '2026-05-02',
                },
            ];

            db.query.mockResolvedValue({ rows: mockProjects, rowCount: 1 });

            const res = await request(app).get('/projects/getProjects?search=Test');

            expect(res.status).toBe(200);
            expect(res.body.projects).toHaveLength(1);
        });

        test('should return empty array when no projects found', async () => {
            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            const res = await request(app).get('/projects/getProjects');

            expect(res.status).toBe(200);
            expect(res.body.projects).toEqual([]);
        });

        test('should return 500 when database query fails', async () => {
            db.query.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/projects/getProjects');

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('msg');
        });
    });

    describe('GET /projects/getProject/:id', () => {
        test('should return project by id with 200', async () => {
            const mockProject = {
                id: 1,
                nombre: 'Test Project',
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            // Helper projectExistsById
            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });
            // Service getProjectById
            db.query.mockResolvedValueOnce({ rows: [mockProject], rowCount: 1 });

            const res = await request(app).get('/projects/getProject/1');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('msg', 'Proyecto obtenido correctamente');
            expect(res.body).toHaveProperty('project');
            expect(res.body.project.id).toBe(1);
        });

        test('should return 400 when id is invalid', async () => {
            const res = await request(app).get('/projects/getProject/invalid');

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 400 when project does not exist', async () => {
            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            const res = await request(app).get('/projects/getProject/999');

            expect(res.status).toBe(400);
        });

        test('should return 500 when database query fails', async () => {
            // Helper projectExistsById
            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });
            // Service getProjectById
            db.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).get('/projects/getProject/1');

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('msg');
        });
    });

    describe('PUT /projects/updateProject/:id', () => {
        test('should update project and return 200', async () => {
            const projectId = 1;
            const payload = { nombre: 'Updated Project' };
            const mockProject = {
                id: 1,
                nombre: 'Updated Project',
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            // Helper projectExistsById
            db.query.mockResolvedValueOnce({ rows: [{ id: projectId }], rowCount: 1 });
            // Service updateProject
            db.query.mockResolvedValueOnce({ rows: [mockProject], rowCount: 1 });

            const res = await request(app)
                .put(`/projects/updateProject/${projectId}`)
                .send(payload);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('msg', 'Proyecto actualizado correctamente');
            expect(res.body.project.nombre).toBe('Updated Project');
        });

        test('should return 400 when id is invalid', async () => {
            const payload = { nombre: 'Updated Project' };

            const res = await request(app)
                .put('/projects/updateProject/invalid')
                .send(payload);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 400 when nombre is missing', async () => {
            const res = await request(app).put('/projects/updateProject/1').send({});

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 400 when project does not exist', async () => {
            const payload = { nombre: 'Updated Project' };

            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            const res = await request(app)
                .put('/projects/updateProject/999')
                .send(payload);

            expect(res.status).toBe(400);
        });

        test('should return 500 when database query fails', async () => {
            const payload = { nombre: 'Updated Project' };

            // Helper projectExistsById
            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });
            // Service updateProject
            db.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app)
                .put('/projects/updateProject/1')
                .send(payload);

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('msg');
        });
    });

    describe('DELETE /projects/deleteProject/:id', () => {
        test('should delete project and return 200', async () => {
            // Helper projectExistsById
            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });
            // Service deleteProject
            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });

            const res = await request(app).delete('/projects/deleteProject/1');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('msg', 'Proyecto eliminado correctamente');
        });

        test('should return 400 when id is invalid', async () => {
            const res = await request(app).delete('/projects/deleteProject/invalid');

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
        });

        test('should return 400 when project does not exist', async () => {
            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            const res = await request(app).delete('/projects/deleteProject/999');

            expect(res.status).toBe(400);
        });

        test('should return 500 when database query fails', async () => {
            // Helper projectExistsById
            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 });
            // Service deleteProject
            db.query.mockRejectedValueOnce(new Error('Database error'));

            const res = await request(app).delete('/projects/deleteProject/1');

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('msg');
        });
    });
});
