import { Request, Response } from 'express';
import { httpStatusCode } from '../../../../constants/httpStatusCode.constants';
import { sendResponse } from '../../../../utils/sendResponse';
import { taskMessages } from './task.message';
import { TaskService } from './task.service';

const taskService = new TaskService();

export const createTask = async (req: Request, res: Response) => {
  const result = await taskService.createTask(req.user._id, req.body);
  sendResponse(res, {
    statusCode: httpStatusCode.CREATED,
    success: true,
    message: taskMessages.CREATE_SUCCESS,
    data: { task: result },
  });
};

export const getAllTasks = async (req: Request, res: Response) => {
  const filter: any = {};
  
  // If projectId is provided, show all tasks for that project
  // Otherwise, only show tasks assigned to the current user
  if (req.query.projectId) {
    filter.projectId = req.query.projectId;
  } else {
    filter.assignedTo = req.user._id;
  }

  if (req.query.status) filter.status = req.query.status;

  const result = await taskService.getAllTasks(filter);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: taskMessages.FETCH_SUCCESS,
    data: { tasks: result },
  });
};

export const getTaskById = async (req: Request, res: Response) => {
  const result = await taskService.getTaskById(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: taskMessages.FETCH_SUCCESS,
    data: { task: result },
  });
};

export const updateTask = async (req: Request, res: Response) => {
  const result = await taskService.updateTask(req.params.id as string, req.user._id, req.body);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: taskMessages.UPDATE_SUCCESS,
    data: { task: result },
  });
};

export const deleteTask = async (req: Request, res: Response) => {
  await taskService.deleteTask(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: taskMessages.DELETE_SUCCESS,
  });
};
