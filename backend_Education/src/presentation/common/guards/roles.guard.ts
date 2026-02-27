import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  applyDecorators,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserRole } from '../../../domain/entities';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRole[]) =>
  applyDecorators(SetMetadata(ROLES_KEY, roles));

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) return true;

    const { user } = context.switchToHttp().getRequest<{ user?: { role: UserRole } }>();
    if (!user?.role) {
      throw new ForbiddenException('Access denied');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
