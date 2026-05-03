import { Router } from 'express';
import { check } from 'express-validator';

import { evmCtrl } from '../controllers/evm.controller.js';
import { activityHelpers } from '../helpers/activity.helper.js';
import { projectHelpers } from '../helpers/project.helper.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';

const router = Router();

router.get(
    '/getActivityEvm/:id',
    [
        check('id')
            .isInt({ min: 1 })
            .withMessage('El id de la actividad debe ser un numero entero positivo'),
        check('id').custom(activityHelpers.activityExistsById),
        validateFields,
    ],
    evmCtrl.getActivityEvm
);

router.get(
    '/getProjectEvm/:projectId',
    [
        check('projectId')
            .isInt({ min: 1 })
            .withMessage('El id del proyecto debe ser un numero entero positivo'),
        check('projectId').custom(projectHelpers.projectExistsById),
        check('projectId').custom(projectHelpers.projectHasActivities),
        validateFields,
    ],
    evmCtrl.getProjectEvm
);

export default router;