import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';
import { AuthService } from '../../../auth/auth.service';
import type { AuthenticatedUser } from '../../../domain/entities';

export interface SuperAdminLoginInput {
  email: string;
  password: string;
}

export interface SuperAdminLoginResult {
  user: Pick<AuthenticatedUser, 'id' | 'email' | 'name' | 'role'>;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class SuperAdminLoginUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async execute(input: SuperAdminLoginInput): Promise<SuperAdminLoginResult> {
    const admin = await this.prisma.superAdmin.findUnique({
      where: { email: input.email },
    });

    if (!admin || admin.deletedAt) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.authService.validateCredentials(
      '',
      input.email,
      admin.password,
      input.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userLike: AuthenticatedUser = {
      id: admin.id,
      institutionId: '',
      email: admin.email,
      password: admin.password,
      name: admin.name,
      role: 'SUPER_ADMIN',
      isActive: true,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      permissions: [],
    };

    const tokens = await this.authService.generateTokens(userLike);

    return {
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'SUPER_ADMIN',
      },
      ...tokens,
    };
  }
}
