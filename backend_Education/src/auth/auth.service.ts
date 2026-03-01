import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../infrastructure/persistence/prisma/prisma.service';
import type { AuthenticatedUser } from '../domain/entities';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
  }

  async validateCredentials(
    _institutionId: string,
    _email: string,
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async generateTokens(user: AuthenticatedUser): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const payload = {
      sub: user.id,
      institutionId: user.institutionId,
      email: user.email,
      role: user.role,
    };

    const expiresIn = 3600; // 1 hour
    const accessToken = this.jwtService.sign(payload, { expiresIn });

    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      { expiresIn: 604800 },
    ); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        institutionId: user.institutionId || '',
        token: refreshToken,
        expiresAt: new Date(Date.now() + 604800 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }
}
