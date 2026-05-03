import { User, IUser } from '../../../../database/models';
import { RegisterDto } from './auth.validation';

export class AuthRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select('+password');
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).select('-password');
  }

  async createUser(userData: RegisterDto): Promise<IUser> {
    const user = await User.create(userData);
    return user;
  }



  async updateLastLogin(id: string): Promise<void> {
    await User.findByIdAndUpdate(id, { lastLogin: new Date() });
  }

  async changePassword(id: string, newPassword: string): Promise<void> {
    const user = await User.findById(id);
    if (user) {
      user.password = newPassword;
      await user.save();
    }
  }


}
