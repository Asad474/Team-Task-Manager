import jwt from 'jsonwebtoken';
import { AuthRepository } from './auth.repository';
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
} from '../auth/auth.validation';
import { AuthResponse } from '../auth/auth.interface';
import { AppError } from '../../../../utils/AppError';
import { httpStatusCode } from '../../../../constants/httpStatusCode.constants';
import { authMessages } from './auth.message';
import { generateToken } from '../../../../utils/generateToken';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(userData: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.authRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError(httpStatusCode.BAD_REQUEST, authMessages.EMAIL_ALREADY_REGISTERED);
    }

    const user = await this.authRepository.createUser(userData);

    const token = generateToken(user._id.toString());

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(credentials: LoginDto): Promise<AuthResponse> {
    const user = await this.authRepository.findByEmail(credentials.email);
    if (!user) {
      throw new AppError(httpStatusCode.UNAUTHORIZED, authMessages.INVALID_CREDENTIALS);
    }
    if (!user.isActive) {
      throw new AppError(httpStatusCode.FORBIDDEN, authMessages.ACCOUNT_DEACTIVATED);
    }

    const isPasswordValid = await user.comparePassword(credentials.password);
    if (!isPasswordValid) {
      throw new AppError(httpStatusCode.UNAUTHORIZED, authMessages.INVALID_CREDENTIALS);
    }

    await this.authRepository.updateLastLogin(user._id.toString());

    const token = generateToken(user._id.toString());

    console.log(`User logged in: ${user.email}`);

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }


  async changePassword(userId: string, data: ChangePasswordDto) {
    const user = await this.authRepository.findByEmail(
      (await this.authRepository.findById(userId))?.email || ''
    );
    if (!user) {
      throw new AppError(httpStatusCode.NOT_FOUND, authMessages.USER_NOT_FOUND);
    }

    const isPasswordValid = await user.comparePassword(data.currentPassword);
    if (!isPasswordValid) {
      throw new AppError(httpStatusCode.UNAUTHORIZED, authMessages.CURRENT_PASSWORD_INCORRECT);
    }
    
    await this.authRepository.changePassword(userId, data.newPassword);

    console.log(`Password changed for user: ${user.email}`);
  }
}
