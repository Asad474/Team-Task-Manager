import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../constants/roles.constants';
import { AppError } from '../utils/AppError';
import { httpStatusCode } from '../constants/httpStatusCode.constants';
import { commonMessages } from '../constants/commonMessages.constants';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Ensure isAuthenticated was called first
  if (!req.user) {
    return next(new AppError(httpStatusCode.UNAUTHORIZED, commonMessages.UNAUTHORIZED));
  }

  if (req.user.role !== UserRole.ADMIN) {
    return next(new AppError(httpStatusCode.FORBIDDEN, commonMessages.ACCESS_DENIED_ADMIN));
  }

  next();
};
