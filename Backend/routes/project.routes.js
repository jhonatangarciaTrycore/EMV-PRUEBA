import { Router } from 'express';
import { check } from 'express-validator';

import { projectCtrl } from '../controllers/project.controller.js';
import { projectHelpers } from '../helpers/project.helper.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';

const router = Router();

router.post(
    '/saveProject',
    [
        check('nombre')
            .trim()
            .notEmpty()
            .withMessage('El nombre es obligatorio')
            .isLength({ max: 150 })
            .withMessage('El nombre no puede superar 150 caracteres'),
        validateFields,
    ],
    projectCtrl.createProject
);

router.get('/getProjects', projectCtrl.getProjects);

router.get(
    '/getProject/:id',
    [
        check('id')
            .isInt({ min: 1 })
            .withMessage('El id del proyecto debe ser un numero entero positivo'),
        check('id').custom(projectHelpers.projectExistsById),
        validateFields,
    ],
    projectCtrl.getProjectById
);

router.put(
    '/updateProject/:id',
    [
        check('id')
            .isInt({ min: 1 })
            .withMessage('El id del proyecto debe ser un numero entero positivo'),
        check('id').custom(projectHelpers.projectExistsById),
        check('nombre')
            .trim()
            .notEmpty()
            .withMessage('El nombre es obligatorio')
            .isLength({ max: 150 })
            .withMessage('El nombre no puede superar 150 caracteres'),
        validateFields,
    ],
    projectCtrl.updateProject
);

router.delete(
    '/deleteProject/:id',
    [
        check('id')
            .isInt({ min: 1 })
            .withMessage('El id del proyecto debe ser un numero entero positivo'),
        check('id').custom(projectHelpers.projectExistsById),
        validateFields,
    ],
    projectCtrl.deleteProject
);

export default router;
