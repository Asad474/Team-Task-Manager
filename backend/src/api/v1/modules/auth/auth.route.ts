import { Router } from 'express';
import { isAuthenticated } from '../../../../middleware/isAuthenticated';
import validateRequest from '../../../../middleware/validator';
import * as authController from './auth.controller';
import { changePasswordSchema, loginSchema, registerSchema } from './auth.validation';

const authRouter = Router();

authRouter.post('/register', validateRequest(registerSchema), authController.register);
authRouter.post('/login', validateRequest(loginSchema), authController.login);
authRouter.post('/change-password', isAuthenticated, validateRequest(changePasswordSchema), authController.changePassword);
authRouter.post('/logout', isAuthenticated, authController.logout);

export default authRouter;