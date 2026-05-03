import { evmService } from '../services/evm.service.js';

const evmCtrl = {};

evmCtrl.getActivityEvm = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await evmService.getActivityEvm(id);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in getActivityEvm:', error);

        const statusCode = error.message === 'Actividad no encontrada' ? 404 : 500;

        return res.status(statusCode).json({
            msg: error.message,
        });
    }
};

evmCtrl.getProjectEvm = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { activities } = req;
        const result = await evmService.getProjectEvm(projectId, activities);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in getProjectEvm:', error);

        const statusCode = error.message === 'Proyecto no encontrado' ? 404 : 500;

        return res.status(statusCode).json({
            msg: error.message,
        });
    }
};

export { evmCtrl };