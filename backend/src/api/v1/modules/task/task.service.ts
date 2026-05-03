import mongoose from 'mongoose';
import { httpStatusCode } from '../../../../constants/httpStatusCode.constants';
import { ITask } from '../../../../database/models/Task.model';
import { AppError } from '../../../../utils/AppError';
import { taskMessages } from './task.message';
import { TaskRepository } from './task.repository';

export class TaskService {
  private taskRepository = new TaskRepository();

  async createTask(userId: string, data: Partial<ITask>): Promise<ITask> {
    const taskData = {
      ...data,
      projectId: new mongoose.Types.ObjectId(data.projectId as any),
      assignedBy: new mongoose.Types.ObjectId(userId),
      assignedTo: new mongoose.Types.ObjectId((data.assignedTo || userId) as any),
    };
    return await this.taskRepository.create(taskData as any);
  }

  async getAllTasks(filter: any): Promise<ITask[]> {
    return await this.taskRepository.find(filter);
  }

  async getTaskById(id: string): Promise<ITask> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new AppError(httpStatusCode.NOT_FOUND, taskMessages.NOT_FOUND);
    }
    return task;
  }

  async updateTask(id: string, userId: string, data: Partial<ITask>): Promise<ITask> {
    await this.getTaskById(id);
    
    const updateData = { ...data };
    if (data.assignedTo) {
      updateData.assignedTo = new mongoose.Types.ObjectId(data.assignedTo as any) as any;
    }

    const updatedTask = await this.taskRepository.update(id, updateData);
    if (!updatedTask) {
      throw new AppError(httpStatusCode.NOT_FOUND, taskMessages.NOT_FOUND);
    }
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.taskRepository.delete(id);
    if (!task) {
      throw new AppError(httpStatusCode.NOT_FOUND, taskMessages.NOT_FOUND);
    }
  }
}
