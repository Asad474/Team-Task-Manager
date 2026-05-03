import { httpStatusCode } from '../../../../constants/httpStatusCode.constants';
import { UserRole } from '../../../../constants/roles.constants';
import { AppError } from '../../../../utils/AppError';
import { userMessages } from './user.message';
import { UserRepository } from './user.repository';
import { UpdateProfileDto } from './user.validation';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(httpStatusCode.NOT_FOUND,userMessages.USER_NOT_FOUND, false);
    }
    return user;
  }

  async updateProfile(userId: string, updateData: UpdateProfileDto) {
    if (updateData.email) {
      const existingUser = await this.userRepository.findByEmail(updateData.email);
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new AppError(httpStatusCode.BAD_REQUEST, userMessages.EMAIL_ALREADY_REGISTERED, false);
      }
    }

    const user = await this.userRepository.updateUser(userId, updateData);
    if (!user) {
      throw new AppError(httpStatusCode.NOT_FOUND, userMessages.USER_NOT_FOUND, false);
    }

    console.log(`User profile updated: ${user.email}`);
    return user;
  }

  async getAllUsers(role: string, page: number, limit: number) {
    // Only admin can view all users
    if (role !== UserRole.ADMIN) {
      throw new AppError(httpStatusCode.FORBIDDEN, userMessages.ACCESS_DENIED, false);
    }

    return await this.userRepository.getAllUsers(page, limit);
  }

  async deleteUser(requesterId: string, requesterRole: string, userIdToDelete: string) {
    // Only admin can delete users
    if (requesterRole !== UserRole.ADMIN) {
      throw new AppError(httpStatusCode.FORBIDDEN, userMessages.ACCESS_DENIED, false);
    }

    // Prevent self-deletion
    if (requesterId === userIdToDelete) {
      throw new AppError(httpStatusCode.BAD_REQUEST, userMessages.CANNOT_DELETE_SELF, false);
    }

    await this.userRepository.deleteUser(userIdToDelete);
  }
}
