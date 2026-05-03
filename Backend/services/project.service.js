import { db } from '../db.config.js';

const projectService = {};

projectService.createProject = async (payload) => {
    try {
        const query = `
            INSERT INTO projects (nombre)
            VALUES ($1)
            RETURNING id, nombre, created_at, updated_at
        `;

        const result = await db.query(query, [payload.nombre]);
        const project = result.rows[0];

        return {
            msg: 'Proyecto creado correctamente',
            project,
        };
    } catch (error) {
        throw new Error('No se pudo crear el proyecto');
    }
};

projectService.getProjects = async (searchTerm = null) => {
    try {
        let query = `
            SELECT id, nombre, created_at, updated_at
            FROM projects
        `;
        const queryParams = [];

        if (searchTerm) {
            query += ` WHERE nombre ILIKE '%' || $1 || '%'`;
            queryParams.push(searchTerm);
        }

        query += ` ORDER BY id ASC`;

        const result = await db.query(query, queryParams);
        const projects = result.rows;

        return {
            msg: 'Proyectos obtenidos correctamente',
            projects,
        };
    } catch (error) {
        throw new Error('No se pudieron obtener los proyectos');
    }
};

projectService.getProjectById = async (projectId) => {
    try {
        const query = `
            SELECT id, nombre, created_at, updated_at
            FROM projects
            WHERE id = $1
            LIMIT 1
        `;

        const result = await db.query(query, [projectId]);
        const project = result.rows[0] || null;

        return {
            msg: 'Proyecto obtenido correctamente',
            project,
        };
    } catch (error) {
        throw new Error('No se pudo obtener el proyecto');
    }
};

projectService.updateProject = async (projectId, payload) => {
    try {
        const query = `
            UPDATE projects
            SET nombre = $2,
                updated_at = NOW()
            WHERE id = $1
            RETURNING id, nombre, created_at, updated_at
        `;

        const result = await db.query(query, [projectId, payload.nombre]);
        const project = result.rows[0] || null;

        return {
            msg: 'Proyecto actualizado correctamente',
            project,
        };
    } catch (error) {
        throw new Error('No se pudo actualizar el proyecto');
    }
};

projectService.deleteProject = async (projectId) => {
    try {
        const query = 'DELETE FROM projects WHERE id = $1 RETURNING id';
        const result = await db.query(query, [projectId]);
        const deleted = result.rows[0] || null;

        return {
            msg: 'Proyecto eliminado correctamente',
        };
    } catch (error) {
        throw new Error('No se pudo eliminar el proyecto');
    }
};

export { projectService };
