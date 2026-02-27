import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';

export const INSTITUTION_ID_HEADER = 'x-institution-id';
export const INSTITUTION_ID_PARAM = 'institutionId';

/**
 * Ensures every request is scoped by institution_id
 * Use header x-institution-id or extract from JWT/route
 */
@Injectable()
export class InstitutionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const institutionId =
      request.headers[INSTITUTION_ID_HEADER.toLowerCase()] as string ||
      request.params[INSTITUTION_ID_PARAM] ||
      (request as Request & { user?: { institutionId?: string } }).user
        ?.institutionId;

    if (!institutionId) {
      throw new BadRequestException(
        'Institution context required. Provide x-institution-id header.',
      );
    }

    (request as Request & { institutionId: string }).institutionId =
      institutionId;
    return true;
  }
}
