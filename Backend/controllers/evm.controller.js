import { evmService } from '../services/evm.service.js';

const evmCtrl = {};

evmCtrl.getActivityEvm = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await evmService.getActivityEvm(id);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in getActivityEvm:', error);

        return res.status(500).json({
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

        return res.status(500).json({
            msg: error.message,
        });
    }
};

export { evmCtrl };