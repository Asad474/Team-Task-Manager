import { Request, Response } from 'express';
import { UserService } from './user.service';
import { sendResponse } from '../../../../utils/sendResponse';
import { httpStatusCode } from '../../../../constants/httpStatusCode.constants';
import { userMessages } from './user.message';

const userService = new UserService();

export const getProfile = async (req: Request, res: Response) => {
  const user = await userService.getProfile(req.user._id);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    data: { user },
    message: userMessages.PROFILE_FETCHED,
    success: true,
  });
};

export const updateProfile = async (req: Request, res: Response) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    data: { user },
    message: userMessages.PROFILE_UPDATED,
    success: true,
  });
};

export const getAllUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await userService.getAllUsers(req.user.role, page, limit);

  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    data: result,
    message: userMessages.USERS_FETCHED,
    success: true,
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  await userService.deleteUser(req.user._id, req.user.role, req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    message: userMessages.USER_DELETED,
    success: true,
  });
};
