import { Router } from 'express';
import { isAuthenticated } from '../../../../middleware/isAuthenticated';
import validateRequest from '../../../../middleware/validator';
import * as projectController from './project.controller';
import { addMemberSchema, createProjectSchema, projectIdParamSchema, updateProjectSchema } from './project.validation';

const router = Router();

router.use(isAuthenticated);

router.post('/', validateRequest(createProjectSchema), projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/:id', validateRequest(projectIdParamSchema), projectController.getProjectById);
router.patch('/:id', validateRequest(updateProjectSchema), projectController.updateProject);
router.delete('/:id', validateRequest(projectIdParamSchema), projectController.deleteProject);
router.post('/:id/members', validateRequest(addMemberSchema), projectController.addMember);

export default router;
