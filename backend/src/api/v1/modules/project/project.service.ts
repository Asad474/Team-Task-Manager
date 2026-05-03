import { ProjectRepository } from './project.repository';
import { CreateProjectDto, UpdateProjectDto } from './project.validation';
import { AppError } from '../../../../utils/AppError';
import { httpStatusCode } from '../../../../constants/httpStatusCode.constants';
import { projectMessages } from './project.message';
import { UserRole } from '../../../../constants/roles.constants';
import { User } from '../../../../database/models/User.model';

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  async createProject(userId: string, data: CreateProjectDto) {
    return await this.projectRepository.create(userId, data);
  }

  async getProjectById(projectId: string, userId: string, userRole: string) {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new AppError(httpStatusCode.NOT_FOUND, projectMessages.PROJECT_NOT_FOUND);
    }

    // Check access
    const isOwner = project.owner._id.toString() === userId;
    const isMember = project.members.some((member: any) => member._id.toString() === userId);
    const isAdmin = userRole === UserRole.ADMIN;

    if (!isOwner && !isMember && !isAdmin) {
      throw new AppError(httpStatusCode.FORBIDDEN, 'Access denied to this project');
    }

    return project;
  }

  async getAllProjects(userId: string, userRole: string) {
    if (userRole === UserRole.ADMIN) {
      return await this.projectRepository.findAllForAdmin();
    }
    return await this.projectRepository.findAllForUser(userId);
  }

  async updateProject(projectId: string, userId: string, userRole: string, data: UpdateProjectDto) {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new AppError(httpStatusCode.NOT_FOUND, projectMessages.PROJECT_NOT_FOUND);
    }

    const isOwner = project.owner._id.toString() === userId;
    const isAdmin = userRole === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new AppError(httpStatusCode.FORBIDDEN, 'Only project owners or admins can update this project');
    }

    return await this.projectRepository.update(projectId, data);
  }

  async deleteProject(projectId: string, userId: string, userRole: string) {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new AppError(httpStatusCode.NOT_FOUND, projectMessages.PROJECT_NOT_FOUND);
    }

    const isOwner = project.owner._id.toString() === userId;
    const isAdmin = userRole === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new AppError(httpStatusCode.FORBIDDEN, 'Only project owners or admins can delete this project');
    }

    await this.projectRepository.delete(projectId);
  }

  async addMember(projectId: string, userId: string, email: string, userRole: string) {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new AppError(httpStatusCode.NOT_FOUND, projectMessages.PROJECT_NOT_FOUND);
    }

    const isOwner = project.owner._id.toString() === userId;
    const isAdmin = userRole === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new AppError(httpStatusCode.FORBIDDEN, 'Only project owners or admins can add members');
    }

    // Find user by email
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      throw new AppError(httpStatusCode.NOT_FOUND, 'User not found with this email');
    }

    // Check if user is already a member
    const isAlreadyMember = project.members.some((member: any) => member._id.toString() === userToAdd._id.toString());
    if (isAlreadyMember) {
      throw new AppError(httpStatusCode.BAD_REQUEST, 'User is already a member of this project');
    }

    // Check if user is the owner
    if (project.owner._id.toString() === userToAdd._id.toString()) {
      throw new AppError(httpStatusCode.BAD_REQUEST, 'Project owner is already a member');
    }

    project.members.push(userToAdd._id as any);
    await project.save();

    // Re-fetch project to get populated members
    return await this.projectRepository.findById(projectId);
  }
}
