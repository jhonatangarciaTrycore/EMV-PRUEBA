import { Router } from 'express';
import { check } from 'express-validator';

import { activityCtrl } from '../controllers/activity.controller.js';
import { activityHelpers } from '../helpers/activity.helper.js';
import { projectHelpers } from '../helpers/project.helper.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';

const router = Router();

router.post(
    '/saveActivity/:projectId',
    [
        check('projectId')
            .isInt({ min: 1 })
            .withMessage('El id del proyecto debe ser un numero entero positivo'),
        check('projectId').custom(projectHelpers.projectExistsById),
        check('nombre')
            .trim()
            .notEmpty()
            .withMessage('El nombre es obligatorio')
            .isLength({ max: 150 })
            .withMessage('El nombre no puede superar 150 caracteres'),
        check('bac')
            .isFloat({ min: 0 })
            .withMessage('El BAC debe ser un numero mayor o igual a 0'),
        check('planned_percent')
            .isFloat({ min: 0, max: 100 })
            .withMessage('El porcentaje planificado debe estar entre 0 y 100'),
        check('actual_percent')
            .isFloat({ min: 0, max: 100 })
            .withMessage('El porcentaje real debe estar entre 0 y 100'),
        check('actual_cost')
            .isFloat({ min: 0 })
            .withMessage('El costo real debe ser un numero mayor o igual a 0'),
        validateFields,
    ],
    activityCtrl.createActivity
);

router.get(
    '/getActivities/:projectId',
    [
        check('projectId')
            .isInt({ min: 1 })
            .withMessage('El id del proyecto debe ser un numero entero positivo'),
        check('projectId').custom(projectHelpers.projectExistsById),
        validateFields,
    ],
    activityCtrl.getActivitiesByProject
);

router.get(
    '/getActivity/:id',
    [
        check('id')
            .isInt({ min: 1 })
            .withMessage('El id de la actividad debe ser un numero entero positivo'),
        check('id').custom(activityHelpers.activityExistsById),
        validateFields,
    ],
    activityCtrl.getActivityById
);

router.put(
    '/updateActivity/:id',
    [
        check('id')
            .isInt({ min: 1 })
            .withMessage('El id de la actividad debe ser un numero entero positivo'),
        check('id').custom(activityHelpers.activityExistsById),
        check('nombre')
            .trim()
            .notEmpty()
            .withMessage('El nombre es obligatorio')
            .isLength({ max: 150 })
            .withMessage('El nombre no puede superar 150 caracteres'),
        check('bac')
            .isFloat({ min: 0 })
            .withMessage('El BAC debe ser un numero mayor o igual a 0'),
        check('planned_percent')
            .isFloat({ min: 0, max: 100 })
            .withMessage('El porcentaje planificado debe estar entre 0 y 100'),
        check('actual_percent')
            .isFloat({ min: 0, max: 100 })
            .withMessage('El porcentaje real debe estar entre 0 y 100'),
        check('actual_cost')
            .isFloat({ min: 0 })
            .withMessage('El costo real debe ser un numero mayor o igual a 0'),
        validateFields,
    ],
    activityCtrl.updateActivity
);

router.delete(
    '/deleteActivity/:id',
    [
        check('id')
            .isInt({ min: 1 })
            .withMessage('El id de la actividad debe ser un numero entero positivo'),
        check('id').custom(activityHelpers.activityExistsById),
        validateFields,
    ],
    activityCtrl.deleteActivity
);

export default router;
