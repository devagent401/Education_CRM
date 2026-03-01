import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';
import type { AuthenticatedUser } from '../../../domain/entities';

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: RefreshTokenInput): Promise<RefreshTokenResult> {
    let payload: { sub: string; institutionId?: string; email: string; role: string; type?: string };
    try {
      payload = this.jwtService.verify(input.refreshToken, {
        secret: this.config.get<string>('JWT_SECRET') || 'change-me-in-production',
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const stored = await this.prisma.refreshToken.findFirst({
      where: {
        token: input.refreshToken,
        userId: payload.sub,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!stored) {
      throw new UnauthorizedException('Refresh token revoked or expired');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const userLike: AuthenticatedUser = {
      id: payload.sub,
      institutionId: payload.institutionId || '',
      email: payload.email,
      password: '',
      name: '',
      role: payload.role as AuthenticatedUser['role'],
      isActive: true,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const expiresIn = 3600;
    const accessToken = this.jwtService.sign(
      {
        sub: userLike.id,
        institutionId: userLike.institutionId,
        email: userLike.email,
        role: userLike.role,
      },
      { expiresIn },
    );

    const newRefreshToken = this.jwtService.sign(
      {
        sub: userLike.id,
        institutionId: userLike.institutionId,
        email: userLike.email,
        role: userLike.role,
        type: 'refresh',
      },
      { expiresIn: 604800 },
    );

    await this.prisma.refreshToken.create({
      data: {
        userId: userLike.id,
        institutionId: userLike.institutionId || '',
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 604800 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    };
  }
}
