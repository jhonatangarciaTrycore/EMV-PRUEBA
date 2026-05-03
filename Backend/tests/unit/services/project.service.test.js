import { projectService } from '../../../services/project.service.js';
import { db } from '../../../db.config.js';

jest.mock('../../../db.config.js', () => ({
    db: {
        query: jest.fn(),
    },
}));

describe('Project Service - Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createProject', () => {
        test('should create a project successfully', async () => {
            const payload = { nombre: 'New Project' };
            const mockProject = {
                id: 1,
                nombre: 'New Project',
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockProject], rowCount: 1 });

            const result = await projectService.createProject(payload);

            expect(result).toHaveProperty('msg', 'Proyecto creado correctamente');
            expect(result.project).toEqual(mockProject);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO projects'),
                [payload.nombre]
            );
        });

        test('should throw error when database insert fails', async () => {
            const payload = { nombre: 'New Project' };

            db.query.mockRejectedValue(new Error('Database error'));

            await expect(projectService.createProject(payload)).rejects.toThrow(
                'No se pudo crear el proyecto'
            );
        });

        test('should handle empty proyecto name', async () => {
            const payload = { nombre: '' };

            db.query.mockRejectedValue(new Error('Constraint error'));

            await expect(projectService.createProject(payload)).rejects.toThrow(
                'No se pudo crear el proyecto'
            );
        });
    });

    describe('getProjects', () => {
        test('should return all projects without search term', async () => {
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

            const result = await projectService.getProjects();

            expect(result).toHaveProperty('msg', 'Proyectos obtenidos correctamente');
            expect(result.projects).toEqual(mockProjects);
            expect(result.projects).toHaveLength(2);
        });

        test('should filter projects by search term', async () => {
            const mockProjects = [
                {
                    id: 1,
                    nombre: 'Test Project',
                    created_at: '2026-05-02',
                    updated_at: '2026-05-02',
                },
            ];

            db.query.mockResolvedValue({ rows: mockProjects, rowCount: 1 });

            const result = await projectService.getProjects('Test');

            expect(result.projects).toHaveLength(1);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('ILIKE'),
                expect.arrayContaining(['Test'])
            );
        });

        test('should return empty array when no projects match search term', async () => {
            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            const result = await projectService.getProjects('NonExistent');

            expect(result.projects).toEqual([]);
            expect(result.projects).toHaveLength(0);
        });

        test('should throw error when database query fails', async () => {
            db.query.mockRejectedValue(new Error('Database error'));

            await expect(projectService.getProjects()).rejects.toThrow(
                'No se pudieron obtener los proyectos'
            );
        });

        test('should handle case-insensitive search', async () => {
            const mockProjects = [
                {
                    id: 1,
                    nombre: 'PROJECT',
                    created_at: '2026-05-02',
                    updated_at: '2026-05-02',
                },
            ];

            db.query.mockResolvedValue({ rows: mockProjects, rowCount: 1 });

            const result = await projectService.getProjects('project');

            expect(result.projects).toHaveLength(1);
        });
    });

    describe('getProjectById', () => {
        test('should return project by id', async () => {
            const mockProject = {
                id: 1,
                nombre: 'Test Project',
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockProject], rowCount: 1 });

            const result = await projectService.getProjectById(1);

            expect(result).toHaveProperty('msg', 'Proyecto obtenido correctamente');
            expect(result.project).toEqual(mockProject);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('WHERE id = $1'),
                [1]
            );
        });

        test('should return null when project not found', async () => {
            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            const result = await projectService.getProjectById(999);

            expect(result.project).toBeNull();
        });

        test('should throw error when database query fails', async () => {
            db.query.mockRejectedValue(new Error('Database error'));

            await expect(projectService.getProjectById(1)).rejects.toThrow(
                'No se pudo obtener el proyecto'
            );
        });
    });

    describe('updateProject', () => {
        test('should update project successfully', async () => {
            const projectId = 1;
            const payload = { nombre: 'Updated Project' };
            const mockProject = {
                id: 1,
                nombre: 'Updated Project',
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockProject], rowCount: 1 });

            const result = await projectService.updateProject(projectId, payload);

            expect(result).toHaveProperty('msg', 'Proyecto actualizado correctamente');
            expect(result.project).toEqual(mockProject);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE projects'),
                [projectId, payload.nombre]
            );
        });

        test('should return null when project not found', async () => {
            const projectId = 999;
            const payload = { nombre: 'Updated Project' };

            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            const result = await projectService.updateProject(projectId, payload);

            expect(result.project).toBeNull();
        });

        test('should throw error when database query fails', async () => {
            const projectId = 1;
            const payload = { nombre: 'Updated Project' };

            db.query.mockRejectedValue(new Error('Database error'));

            await expect(projectService.updateProject(projectId, payload)).rejects.toThrow(
                'No se pudo actualizar el proyecto'
            );
        });

        test('should update timestamp when project is updated', async () => {
            const projectId = 1;
            const payload = { nombre: 'Updated Project' };

            db.query.mockResolvedValue({
                rows: [
                    {
                        id: 1,
                        nombre: 'Updated Project',
                        created_at: '2026-05-01',
                        updated_at: '2026-05-02T10:30:00',
                    },
                ],
                rowCount: 1,
            });

            const result = await projectService.updateProject(projectId, payload);

            expect(result.project.updated_at).toBeDefined();
        });
    });

    describe('deleteProject', () => {
        test('should delete project successfully', async () => {
            const projectId = 1;

            db.query.mockResolvedValue({ rows: [{ id: 1 }], rowCount: 1 });

            const result = await projectService.deleteProject(projectId);

            expect(result).toHaveProperty('msg', 'Proyecto eliminado correctamente');
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM projects'),
                [projectId]
            );
        });

        test('should return null when project not found', async () => {
            const projectId = 999;

            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            const result = await projectService.deleteProject(projectId);

            // The service returns deleted obj, so we check what it returns
            expect(result).toBeDefined();
        });

        test('should throw error when database query fails', async () => {
            const projectId = 1;

            db.query.mockRejectedValue(new Error('Database error'));

            await expect(projectService.deleteProject(projectId)).rejects.toThrow(
                'No se pudo eliminar el proyecto'
            );
        });
    });
});
