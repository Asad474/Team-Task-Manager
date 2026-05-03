import { User, IUser } from '../../../../database/models';
import { UpdateProfileDto } from './user.validation';

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select('+password');
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).select('-password');
  }

  async updateUser(id: string, updateData: Partial<UpdateProfileDto>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');
  }

  async getAllUsers(page: number = 1, limit: number = 10, filter?: { role?: string }) {
    const skip = (page - 1) * limit;
    const query: any = { isActive: true };

    if (filter?.role) {
      query.role = filter.role;
    }

    const [users, total] = await Promise.all([
      User.find(query).select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteUser(id: string): Promise<void> {
    await User.findByIdAndUpdate(id, { isActive: false });
  }
}
