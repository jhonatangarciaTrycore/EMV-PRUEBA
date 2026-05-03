import { db } from '../db.config.js';

const activityHelpers = {};

activityHelpers.activityExistsById = async (activityId) => {
    const result = await db.query(
        'SELECT id FROM activities WHERE id = $1 LIMIT 1',
        [activityId]
    );

    if (result.rowCount === 0) {
        throw new Error('Actividad no encontrada');
    }

    return true;
};

export { activityHelpers };
