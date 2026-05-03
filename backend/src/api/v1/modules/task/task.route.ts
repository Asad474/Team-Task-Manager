import { Router } from 'express';
import { isAuthenticated } from '../../../../middleware/isAuthenticated';
import validateRequest from '../../../../middleware/validator';
import { asyncHandler } from '../../../../utils/asyncHandler';
import * as taskController from './task.controller';
import * as taskValidation from './task.validation';

const router = Router();

router.use(isAuthenticated);

router.post(
  '/',
  validateRequest(taskValidation.createTaskSchema),
  asyncHandler(taskController.createTask)
);

router.get(
  '/',
  asyncHandler(taskController.getAllTasks)
);

router.get(
  '/:id',
  validateRequest(taskValidation.taskIdParamSchema),
  asyncHandler(taskController.getTaskById)
);

router.patch(
  '/:id',
  validateRequest(taskValidation.updateTaskSchema),
  asyncHandler(taskController.updateTask)
);

router.delete(
  '/:id',
  validateRequest(taskValidation.taskIdParamSchema),
  asyncHandler(taskController.deleteTask)
);

export default router;
