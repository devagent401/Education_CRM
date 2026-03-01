import {
  Injectable,
  ConflictException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import type {
  IUserRepository,
  IInstitutionRepository,
  CreateUserInput,
} from '../../../domain/repositories';
import type { AuthenticatedUser } from '../../../domain/entities';
import type { IAuthService } from './login.use-case';

export interface RegisterInput {
  institutionId: string;
  email: string;
  password: string;
  name: string;
  role: CreateUserInput['role'];
  phone?: string;
}

export interface RegisterResult {
  user: AuthenticatedUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IInstitutionRepository')
    private readonly institutionRepository: IInstitutionRepository,
    @Inject('IAuthService')
    private readonly authService: IAuthService,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterResult> {
    const institution = await this.institutionRepository.findById(
      input.institutionId,
    );
    if (!institution) {
      throw new BadRequestException('Institution not found');
    }

    const existingUser = await this.userRepository.findByEmail(
      input.institutionId,
      input.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already registered for this institution');
    }

    const hashedPassword = await this.authService.hashPassword(input.password);

    const user = await this.userRepository.create({
      institutionId: input.institutionId,
      email: input.email,
      password: hashedPassword,
      name: input.name,
      role: input.role,
      phone: input.phone,
    });

    const authenticatedUser: AuthenticatedUser = {
      ...user,
      permissions: [],
    };

    const tokens = await this.authService.generateTokens(authenticatedUser);

    return {
      user: authenticatedUser,
      ...tokens,
    };
  }
}
