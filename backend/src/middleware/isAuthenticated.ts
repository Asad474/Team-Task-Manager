import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { commonMessages } from '../constants/commonMessages.constants';
import { httpStatusCode } from '../constants/httpStatusCode.constants';
import { User } from '../database/models/User.model';
import { AppError } from '../utils/AppError';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new AppError(httpStatusCode.UNAUTHORIZED, commonMessages.TOKEN_MISSING));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { id: string };

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new AppError(httpStatusCode.UNAUTHORIZED, commonMessages.USER_NOT_EXISTS));
    }

    if (!user.isActive) {
      return next(new AppError(httpStatusCode.FORBIDDEN, commonMessages.ACCOUNT_DEACTIVATED));
    }

    req.user = { ...user, _id: user._id.toString() };
    next();
  } catch (error) {
    return next(new AppError(httpStatusCode.UNAUTHORIZED, commonMessages.INVALID_TOKEN));
  }
};
