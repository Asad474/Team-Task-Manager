import { Router } from 'express';
import { isAdmin } from '../../../../middleware/isAdmin';
import { isAuthenticated } from '../../../../middleware/isAuthenticated';
import validateRequest from '../../../../middleware/validator';
import { idParamSchema } from '../../../../utils/commonValidation';
import * as userController from './user.controller';
import { getAllUsersSchema, updateProfileSchema } from './user.validation';

const router = Router();

router.use(isAuthenticated);

router.get('/profile', userController.getProfile);
router.patch('/profile', validateRequest(updateProfileSchema), userController.updateProfile);
router.get('/', isAdmin, validateRequest(getAllUsersSchema), userController.getAllUsers);
router.delete('/:id', isAdmin, validateRequest(idParamSchema), userController.deleteUser);

export default router;
