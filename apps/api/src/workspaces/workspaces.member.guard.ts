import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { WorkspacesService } from './workspaces.service';
import type { AuthenticatedRequest } from '../auth/authenticated.request';

@Injectable()
export class WorkspaceMemberGuard implements CanActivate {
  constructor(private workspacesService: WorkspacesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const workspaceId = String(request.params.workspaceId);
    if (!isUUID(workspaceId)) throw new NotFoundException();
    const userId = request.user?.id;
    if (!userId) throw new UnauthorizedException();
    const member = await this.workspacesService.findMembership(
      workspaceId,
      userId,
    );
    if (!member) throw new ForbiddenException();
    request.member = { role: member.role };
    return true;
  }
}
