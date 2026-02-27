import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { AuthenticatedUser } from '../domain/entities';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

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

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }
}
