import { Task, ITask } from '../../../../database/models/Task.model';

export class TaskRepository {
  async create(data: Partial<ITask>): Promise<ITask> {
    return await Task.create(data);
  }

  async findById(id: string): Promise<ITask | null> {
    return await Task.findById(id).populate('projectId assignedTo assignedBy');
  }

  async find(filter: any): Promise<ITask[]> {
    return await Task.find(filter).populate('assignedTo assignedBy').sort({ createdAt: -1 });
  }

  async update(id: string, data: Partial<ITask>): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<ITask | null> {
    return await Task.findByIdAndDelete(id);
  }
}
