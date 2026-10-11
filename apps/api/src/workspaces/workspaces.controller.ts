import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspaceMemberGuard } from './workspaces.member.guard';
import { CreateWorkspaceDto } from './dto/create.workspace.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import type { AuthenticatedRequest } from '../auth/authenticated.request';
import { RolesGuard } from './roles.guard';
import { Role } from '../generated/prisma/enums';
import { UpdateWorkspaceDto } from './dto/update.workspace.dto';
import { Roles } from './roles.decorator';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateWorkspaceDto) {
    return this.workspacesService.create(req.user!.id, dto.name);
  }

  @UseGuards(JwtAuthGuard, WorkspaceMemberGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Patch(':workspaceId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.update(workspaceId, dto.name);
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

  @UseGuards(JwtAuthGuard, WorkspaceMemberGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Delete(':workspaceId')
  @HttpCode(204)
  async remove(@Param('workspaceId') workspaceId: string) {
    await this.workspacesService.remove(workspaceId);
  }
}
