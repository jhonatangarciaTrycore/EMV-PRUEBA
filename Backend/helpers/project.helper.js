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

export { projectHelpers };
