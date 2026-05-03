import { Project, IProject } from '../../../../database/models/Project.model';
import { CreateProjectDto, UpdateProjectDto } from './project.validation';

export class ProjectRepository {
  async create(ownerId: string, data: CreateProjectDto): Promise<IProject> {
    const project = new Project({
      ...data,
      owner: ownerId,
    });
    return await project.save();
  }

  async findById(id: string): Promise<IProject | null> {
    return await Project.findById(id).populate('owner', 'name email role').populate('members', 'name email role');
  }

  async findAllForAdmin(): Promise<IProject[]> {
    return await Project.find().populate('owner', 'name email').populate('members', 'name email').sort({ createdAt: -1 });
  }

  async findAllForUser(userId: string): Promise<IProject[]> {
    return await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    })
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });
  }

  async update(id: string, data: UpdateProjectDto): Promise<IProject | null> {
    return await Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<IProject | null> {
    return await Project.findByIdAndDelete(id);
  }
}
