import { db } from '../db.config.js';

const activityService = {};

activityService.createActivity = async (projectId, payload) => {
    try {
        const query = `
            INSERT INTO activities (
                project_id,
                nombre,
                bac,
                planned_percent,
                actual_percent,
                actual_cost
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING
                id,
                project_id,
                nombre,
                bac,
                planned_percent,
                actual_percent,
                actual_cost,
                created_at,
                updated_at
        `;

        const values = [
            projectId,
            payload.nombre,
            payload.bac,
            payload.planned_percent,
            payload.actual_percent,
            payload.actual_cost,
        ];

        const result = await db.query(query, values);
        const activity = result.rows[0];

        return {
            msg: 'Actividad creada correctamente',
            activity,
        };
    } catch (error) {
        throw new Error('No se pudo crear la actividad');
    }
};

activityService.getActivitiesByProject = async (projectId) => {
    try {
        const query = `
            SELECT
                id,
                project_id,
                nombre,
                bac,
                planned_percent,
                actual_percent,
                actual_cost,
                created_at,
                updated_at
            FROM activities
            WHERE project_id = $1
            ORDER BY id ASC
        `;

        const result = await db.query(query, [projectId]);

        return {
            msg: 'Actividades obtenidas correctamente',
            activities: result.rows,
        };
    } catch (error) {
        throw new Error('No se pudieron obtener las actividades');
    }
};

activityService.getActivityById = async (activityId) => {
    try {
        const query = `
            SELECT
                id,
                project_id,
                nombre,
                bac,
                planned_percent,
                actual_percent,
                actual_cost,
                created_at,
                updated_at
            FROM activities
            WHERE id = $1
            LIMIT 1
        `;

        const result = await db.query(query, [activityId]);
        const activity = result.rows[0] || null;

        return {
            msg: 'Actividad obtenida correctamente',
            activity,
        };
    } catch (error) {
        throw new Error('No se pudo obtener la actividad');
    }
};

activityService.updateActivity = async (activityId, payload) => {
    try {
        const query = `
            UPDATE activities
            SET nombre = $2,
                bac = $3,
                planned_percent = $4,
                actual_percent = $5,
                actual_cost = $6,
                updated_at = NOW()
            WHERE id = $1
            RETURNING
                id,
                project_id,
                nombre,
                bac,
                planned_percent,
                actual_percent,
                actual_cost,
                created_at,
                updated_at
        `;

        const values = [
            activityId,
            payload.nombre,
            payload.bac,
            payload.planned_percent,
            payload.actual_percent,
            payload.actual_cost,
        ];

        const result = await db.query(query, values);
        const activity = result.rows[0] || null;

        return {
            msg: 'Actividad actualizada correctamente',
            activity,
        };
    } catch (error) {
        throw new Error('No se pudo actualizar la actividad');
    }
};

activityService.deleteActivity = async (activityId) => {
    try {
        const query = 'DELETE FROM activities WHERE id = $1 RETURNING id';
        const result = await db.query(query, [activityId]);
        const deleted = result.rows[0] || null;

        if (!deleted) {
            throw new Error('Actividad no encontrada');
        }

        return {
            msg: 'Actividad eliminada correctamente',
        };
    } catch (error) {
        throw new Error('No se pudo eliminar la actividad');
    }
};

export { activityService };
