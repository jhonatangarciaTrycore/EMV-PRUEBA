import { activityService } from '../../../services/activity.service.js';
import { db } from '../../../db.config.js';

jest.mock('../../../db.config.js', () => ({
    db: {
        query: jest.fn(),
    },
}));

describe('Activity Service - Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createActivity', () => {
        test('should create an activity successfully', async () => {
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
                project_id: 1,
                nombre: 'New Activity',
                bac: 1000,
                planned_percent: 50,
                actual_percent: 40,
                actual_cost: 350,
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockActivity], rowCount: 1 });

            const result = await activityService.createActivity(projectId, payload);

            expect(result).toHaveProperty('msg', 'Actividad creada correctamente');
            expect(result.activity).toEqual(mockActivity);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO activities'),
                expect.arrayContaining([
                    projectId,
                    payload.nombre,
                    payload.bac,
                    payload.planned_percent,
                    payload.actual_percent,
                    payload.actual_cost,
                ])
            );
        });

        test('should throw error when database insert fails', async () => {
            const projectId = 1;
            const payload = {
                nombre: 'New Activity',
                bac: 1000,
                planned_percent: 50,
                actual_percent: 40,
                actual_cost: 350,
            };

            db.query.mockRejectedValue(new Error('Database error'));

            await expect(activityService.createActivity(projectId, payload)).rejects.toThrow(
                'No se pudo crear la actividad'
            );
        });

        test('should handle activity with zero BAC', async () => {
            const projectId = 1;
            const payload = {
                nombre: 'New Activity',
                bac: 0,
                planned_percent: 0,
                actual_percent: 0,
                actual_cost: 0,
            };

            const mockActivity = {
                id: 1,
                project_id: 1,
                ...payload,
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockActivity], rowCount: 1 });

            const result = await activityService.createActivity(projectId, payload);

            expect(result.activity.bac).toBe(0);
        });
    });

    describe('getActivitiesByProject', () => {
        test('should return all activities for a project without search term', async () => {
            const projectId = 1;
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

            db.query.mockResolvedValue({ rows: mockActivities, rowCount: 2 });

            const result = await activityService.getActivitiesByProject(projectId);

            expect(result).toHaveProperty('msg', 'Actividades obtenidas correctamente');
            expect(result.activities).toEqual(mockActivities);
            expect(result.activities).toHaveLength(2);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('WHERE project_id = $1'),
                [projectId]
            );
        });

        test('should filter activities by search term', async () => {
            const projectId = 1;
            const mockActivities = [
                {
                    id: 1,
                    project_id: 1,
                    nombre: 'Test Activity',
                    bac: 1000,
                    planned_percent: 50,
                    actual_percent: 40,
                    actual_cost: 350,
                    created_at: '2026-05-02',
                    updated_at: '2026-05-02',
                },
            ];

            db.query.mockResolvedValue({ rows: mockActivities, rowCount: 1 });

            const result = await activityService.getActivitiesByProject(projectId, 'Test');

            expect(result.activities).toHaveLength(1);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('ILIKE'),
                expect.arrayContaining([projectId, 'Test'])
            );
        });

        test('should return empty array when no activities found', async () => {
            const projectId = 999;

            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            const result = await activityService.getActivitiesByProject(projectId);

            expect(result.activities).toEqual([]);
            expect(result.activities).toHaveLength(0);
        });

        test('should throw error when database query fails', async () => {
            const projectId = 1;

            db.query.mockRejectedValue(new Error('Database error'));

            await expect(activityService.getActivitiesByProject(projectId)).rejects.toThrow(
                'No se pudieron obtener las actividades'
            );
        });

        test('should handle case-insensitive search', async () => {
            const projectId = 1;
            const mockActivities = [
                {
                    id: 1,
                    project_id: 1,
                    nombre: 'ACTIVITY',
                    bac: 1000,
                    planned_percent: 50,
                    actual_percent: 40,
                    actual_cost: 350,
                    created_at: '2026-05-02',
                    updated_at: '2026-05-02',
                },
            ];

            db.query.mockResolvedValue({ rows: mockActivities, rowCount: 1 });

            const result = await activityService.getActivitiesByProject(projectId, 'activity');

            expect(result.activities).toHaveLength(1);
        });
    });

    describe('getActivityById', () => {
        test('should return activity by id', async () => {
            const activityId = 1;
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

            const result = await activityService.getActivityById(activityId);

            expect(result).toHaveProperty('msg', 'Actividad obtenida correctamente');
            expect(result.activity).toEqual(mockActivity);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('WHERE id = $1'),
                [activityId]
            );
        });

        test('should return null when activity not found', async () => {
            const activityId = 999;

            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            const result = await activityService.getActivityById(activityId);

            expect(result.activity).toBeNull();
        });

        test('should throw error when database query fails', async () => {
            const activityId = 1;

            db.query.mockRejectedValue(new Error('Database error'));

            await expect(activityService.getActivityById(activityId)).rejects.toThrow(
                'No se pudo obtener la actividad'
            );
        });
    });

    describe('updateActivity', () => {
        test('should update activity successfully', async () => {
            const activityId = 1;
            const payload = {
                nombre: 'Updated Activity',
                bac: 1200,
                planned_percent: 60,
                actual_percent: 50,
                actual_cost: 600,
            };

            const mockActivity = {
                id: 1,
                project_id: 1,
                ...payload,
                created_at: '2026-05-02',
                updated_at: '2026-05-02',
            };

            db.query.mockResolvedValue({ rows: [mockActivity], rowCount: 1 });

            const result = await activityService.updateActivity(activityId, payload);

            expect(result).toHaveProperty('msg', 'Actividad actualizada correctamente');
            expect(result.activity).toEqual(mockActivity);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE activities'),
                expect.arrayContaining([
                    activityId,
                    payload.nombre,
                    payload.bac,
                    payload.planned_percent,
                    payload.actual_percent,
                    payload.actual_cost,
                ])
            );
        });

        test('should return null when activity not found', async () => {
            const activityId = 999;
            const payload = {
                nombre: 'Updated Activity',
                bac: 1200,
                planned_percent: 60,
                actual_percent: 50,
                actual_cost: 600,
            };

            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            const result = await activityService.updateActivity(activityId, payload);

            expect(result.activity).toBeNull();
        });

        test('should throw error when database query fails', async () => {
            const activityId = 1;
            const payload = {
                nombre: 'Updated Activity',
                bac: 1200,
                planned_percent: 60,
                actual_percent: 50,
                actual_cost: 600,
            };

            db.query.mockRejectedValue(new Error('Database error'));

            await expect(activityService.updateActivity(activityId, payload)).rejects.toThrow(
                'No se pudo actualizar la actividad'
            );
        });
    });

    describe('deleteActivity', () => {
        test('should delete activity successfully', async () => {
            const activityId = 1;

            db.query.mockResolvedValue({ rows: [{ id: 1 }], rowCount: 1 });

            const result = await activityService.deleteActivity(activityId);

            expect(result).toHaveProperty('msg', 'Actividad eliminada correctamente');
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM activities'),
                [activityId]
            );
        });

        test('should throw error when activity not found', async () => {
            const activityId = 999;

            db.query.mockResolvedValue({ rows: [], rowCount: 0 });

            await expect(activityService.deleteActivity(activityId)).rejects.toThrow(
                'No se pudo eliminar la actividad'
            );
        });

        test('should throw error when database query fails', async () => {
            const activityId = 1;

            db.query.mockRejectedValue(new Error('Database error'));

            await expect(activityService.deleteActivity(activityId)).rejects.toThrow(
                'No se pudo eliminar la actividad'
            );
        });
    });
});
