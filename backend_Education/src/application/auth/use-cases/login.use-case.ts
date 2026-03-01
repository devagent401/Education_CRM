import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories';
import type { AuthenticatedUser } from '../../../domain/entities';

export interface LoginInput {
  email: string;
  password: string;
}

export interface InstitutionInfo {
  id: string;
  name: string;
  code: string;
  slug: string;
  logoUrl?: string;
}

export interface LoginResult {
  user: AuthenticatedUser;
  institution: InstitutionInfo;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IAuthService {
  hashPassword(plainPassword: string): Promise<string>;
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
    const userWithInst = await this.userRepository.findByEmailGlobal(input.email);

    if (!userWithInst || !userWithInst.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.authService.validateCredentials(
      userWithInst.institutionId,
      input.email,
      userWithInst.password,
      input.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const authenticatedUser: AuthenticatedUser = {
      ...userWithInst,
      permissions: [],
    };

    const tokens = await this.authService.generateTokens(authenticatedUser);

    await this.userRepository.updateLastLogin(userWithInst.id);

    return {
      user: authenticatedUser,
      institution: userWithInst.institution,
      ...tokens,
    };
  }
}
