import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from '../generated/prisma/enums';
import type { AuthenticatedRequest } from '../auth/authenticated.request';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowed = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    if (!allowed) return true;
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const role = request.member?.role;
    if (!role || !allowed.includes(role)) throw new ForbiddenException();
    return true;
  }
}
