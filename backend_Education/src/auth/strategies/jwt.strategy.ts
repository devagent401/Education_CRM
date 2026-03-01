import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { AuthenticatedUser } from '../../domain/entities';

export interface JwtPayload {
  sub: string;
  institutionId?: string;
  email: string;
  role: string;
  type?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'change-me-in-production',
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (payload.type === 'refresh') {
      throw new UnauthorizedException('Use access token for this request');
    }
    const user: AuthenticatedUser = {
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
    return user;
  }
}
