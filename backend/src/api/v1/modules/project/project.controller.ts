import { Request, Response } from 'express';
import { httpStatusCode } from '../../../../constants/httpStatusCode.constants';
import { sendResponse } from '../../../../utils/sendResponse';
import { projectMessages } from './project.message';
import { ProjectService } from './project.service';

const projectService = new ProjectService();

export const createProject = async (req: Request, res: Response) => {
  const project = await projectService.createProject(req.user._id, req.body);
  sendResponse(res, {
    statusCode: httpStatusCode.CREATED,
    data: { project },
    message: projectMessages.PROJECT_CREATED,
    success: true,
  });
};

export const getAllProjects = async (req: Request, res: Response) => {
  const projects = await projectService.getAllProjects(req.user._id, req.user.role);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    data: { projects },
    message: projectMessages.PROJECTS_FETCHED,
    success: true,
  });
};

export const getProjectById = async (req: Request, res: Response) => {
  const project = await projectService.getProjectById(req.params.id as string, req.user._id, req.user.role);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    data: { project },
    message: projectMessages.PROJECT_FETCHED,
    success: true,
  });
};

export const updateProject = async (req: Request, res: Response) => {
  const project = await projectService.updateProject(req.params.id as string, req.user._id, req.user.role, req.body);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    data: { project },
    message: projectMessages.PROJECT_UPDATED,
    success: true,
  });
};

export const deleteProject = async (req: Request, res: Response) => {
  await projectService.deleteProject(req.params.id as string, req.user._id, req.user.role);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    message: projectMessages.PROJECT_DELETED,
    success: true,
  });
};

export const addMember = async (req: Request, res: Response) => {
  const project = await projectService.addMember(req.params.id as string, req.user._id, req.body.email, req.user.role);
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    data: { project },
    message: projectMessages.MEMBER_ADDED,
    success: true,
  });
};
