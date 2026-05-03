import { projectService } from '../services/project.service.js';

const projectCtrl = {};

projectCtrl.createProject = async (req, res) => {
    try {
        const result = await projectService.createProject(req.body);

        return res.status(201).json(result);
    } catch (error) {
        console.error('Error in createProject:', error);

        return res.status(500).json({
            msg: error.message,
        });
    }
};

projectCtrl.getProjects = async (req, res) => {
    try {
        const { search } = req.query;
        const result = await projectService.getProjects(search || null);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in getProjects:', error);

        return res.status(500).json({
            msg: error.message,
        });
    }
};

projectCtrl.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await projectService.getProjectById(id);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in getProjectById:', error);

        const statusCode = error.message === 'Proyecto no encontrado' ? 404 : 500;

        return res.status(statusCode).json({
            msg: error.message,
        });
    }
};

projectCtrl.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await projectService.updateProject(id, req.body);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in updateProject:', error);

        const statusCode = error.message === 'Proyecto no encontrado' ? 404 : 500;

        return res.status(statusCode).json({
            msg: error.message,
        });
    }
};

projectCtrl.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await projectService.deleteProject(id);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in deleteProject:', error);

        const statusCode = error.message === 'Proyecto no encontrado' ? 404 : 500;

        return res.status(statusCode).json({
            msg: error.message,
        });
    }
};

export { projectCtrl };
