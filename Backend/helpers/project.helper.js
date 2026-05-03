import { db } from '../db.config.js';

const projectHelpers = {};

projectHelpers.projectExistsById = async (projectId) => {
    const result = await db.query(
        'SELECT id FROM projects WHERE id = $1 LIMIT 1',
        [projectId]
    );

    if (result.rowCount === 0) {
        throw new Error('Proyecto no encontrado');
    }

    return true;
};

projectHelpers.projectHasActivities = async (projectId, { req }) => {
    const result = await db.query(
        `SELECT id, project_id, nombre, bac, planned_percent, actual_percent, actual_cost
         FROM activities WHERE project_id = $1 ORDER BY id ASC`,
        [projectId]
    );

    if (result.rowCount === 0) {
        throw new Error('El proyecto no tiene actividades registradas');
    }

    req.activities = result.rows;
    return true;
};

export { projectHelpers };
