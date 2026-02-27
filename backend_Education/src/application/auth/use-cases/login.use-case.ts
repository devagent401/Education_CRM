import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories';
import type { AuthenticatedUser } from '../../../domain/entities';

export interface LoginInput {
  institutionId: string;
  email: string;
  password: string;
}

export interface LoginResult {
  user: AuthenticatedUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IAuthService {
  validateCredentials(
    institutionId: string,
    email: string,
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean>;
  generateTokens(user: AuthenticatedUser): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }>;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IAuthService')
    private readonly authService: IAuthService,
  ) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(
      input.institutionId,
      input.email,
    );

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.authService.validateCredentials(
      input.institutionId,
      input.email,
      user.password,
      input.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const authenticatedUser: AuthenticatedUser = {
      ...user,
      permissions: [], // Resolved from role
    };

    const tokens = await this.authService.generateTokens(authenticatedUser);

    return {
      user: authenticatedUser,
      ...tokens,
    };
  }
}
