import { Router } from 'express';

import authRouter from './auth/auth.route';
import projectRouter from './project/project.route';
import userRouter from './user/user.route';
import taskRouter from './task/task.route';

const mainRouter = Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/user', userRouter);
mainRouter.use('/project', projectRouter);
mainRouter.use('/tasks', taskRouter);

export default mainRouter;