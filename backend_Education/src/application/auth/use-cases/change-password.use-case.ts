import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories';
import type { IAuthService } from './login.use-case';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IAuthService')
    private readonly authService: IAuthService,
  ) {}

  async execute(
    userId: string,
    institutionId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user || user.institutionId !== institutionId) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await this.authService.validateCredentials(
      institutionId,
      user.email,
      user.password,
      currentPassword,
    );
    if (!isValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await this.authService.hashPassword(newPassword);

    await this.userRepository.updatePassword(userId, hashedPassword);

    return { message: 'Password changed successfully' };
  }
}
