import { NextFunction, Request, Response } from 'express';
import { commonMessages } from '../constants/commonMessages.constants';
import { httpStatusCode } from '../constants/httpStatusCode.constants';
import { AppError } from '../utils/AppError';
import { sendResponse } from '../utils/sendResponse';

const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(httpStatusCode.NOT_FOUND, commonMessages.INVALID_ROUTE_REQUESTED);
  next(error);
};

const errorMiddleware = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  let statusCode = httpStatusCode.INTERNAL_SERVER_ERROR;
  let message = commonMessages.SOMETHING_WENT_WRONG as string;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  console.error(err);

  sendResponse(res, {
    success: false,
    statusCode,
    message,
  });
};

export default [notFound, errorMiddleware];
