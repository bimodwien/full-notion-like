import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspaceMemberGuard } from './workspaces.member.guard';
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

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.workspacesService.findAllForUser(req.user!.id);
  }

  @UseGuards(JwtAuthGuard, WorkspaceMemberGuard)
  @Get(':workspaceId')
  findOne(@Param('workspaceId') workspaceId: string) {
    return this.workspacesService.findOne(workspaceId);
  }
}
