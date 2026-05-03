import { activityService } from '../services/activity.service.js';

const activityCtrl = {};

activityCtrl.createActivity = async (req, res) => {
    try {
        const { projectId } = req.params;
        const result = await activityService.createActivity(projectId, req.body);

        return res.status(201).json(result);
    } catch (error) {
        console.error('Error in createActivity:', error);

        return res.status(500).json({
            msg: error.message,
        });
    }
};

activityCtrl.getActivitiesByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const result = await activityService.getActivitiesByProject(projectId);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in getActivitiesByProject:', error);

        return res.status(500).json({
            msg: error.message,
        });
    }
};

activityCtrl.getActivityById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await activityService.getActivityById(id);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in getActivityById:', error);

        return res.status(500).json({
            msg: error.message,
        });
    }
};

activityCtrl.updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await activityService.updateActivity(id, req.body);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in updateActivity:', error);

        return res.status(500).json({
            msg: error.message,
        });
    }
};

activityCtrl.deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await activityService.deleteActivity(id);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in deleteActivity:', error);

        return res.status(500).json({
            msg: error.message,
        });
    }
};

export { activityCtrl };
