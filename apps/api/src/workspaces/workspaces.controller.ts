import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkSpaceDto } from './dto/workspace.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import type { AuthenticatedRequest } from '../auth/authenticated.request';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: WorkSpaceDto) {
    return this.workspacesService.create(req.user!.id, dto.name);
  }
}
