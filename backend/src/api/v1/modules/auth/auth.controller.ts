import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { sendResponse } from '../../../../utils/sendResponse';
import { httpStatusCode } from '../../../../constants/httpStatusCode.constants';
import { authMessages } from './auth.message';
import { setTokenCookie } from '../../../../utils/setTokenCookie';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  const result = await authService.register(req.body);

  setTokenCookie(res, result.token);

  sendResponse(res, {
    statusCode: httpStatusCode.CREATED,
    data: { user: result.user, token: result.token },
    message: authMessages.REGISTER_SUCCESS,
    success: true,
  });
};

export const login = async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  setTokenCookie(res, result.token);

  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    data: { token: result.token },
    message: authMessages.LOGIN_SUCCESS,
    success: true,
  });
};

export const changePassword = async (req: Request, res: Response) => {
  await authService.changePassword(req.user._id, req.body);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    message: authMessages.PASSWORD_CHANGED,
    success: true,
  });
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token');
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    message: authMessages.LOGOUT_SUCCESS,
    success: true,
  });
};
