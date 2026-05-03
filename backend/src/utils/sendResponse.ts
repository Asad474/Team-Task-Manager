import { Response } from 'express';
import { ApiResponse } from '../types/ApiResponse';

export const sendResponse = (
  res: Response,
  responseObj: ApiResponse,
): Response<unknown> => {
  return res.status(responseObj.statusCode).json(responseObj);
};