import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { WorkspaceMemberGuard } from './workspaces.member.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Role } from '../generated/prisma/enums';
import { WorkspaceMembersService } from './workspaces.members.service';
import { AddMemberDto } from './dto/add.member.dto';
import { UpdateMemberDto } from './dto/update.member.dto';

@UseGuards(JwtAuthGuard, WorkspaceMemberGuard, RolesGuard)
@Controller('workspaces/:workspaceId/members')
export class WorkspaceMembersController {
  constructor(private membersService: WorkspaceMembersService) {}

  @Get()
  list(@Param('workspaceId') workspaceId: string) {
    return this.membersService.list(workspaceId);
  }

  @Roles(Role.OWNER)
  @Post()
  add(@Param('workspaceId') workspaceId: string, @Body() dto: AddMemberDto) {
    return this.membersService.add(workspaceId, dto.email, dto.role);
  }

  @Roles(Role.OWNER)
  @Patch(':userId')
  updateRole(
    @Param('workspaceId') workspaceId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateMemberDto,
  ) {
    return this.membersService.updateRole(workspaceId, userId, dto.role);
  }

  @Roles(Role.OWNER)
  @Delete(':userId')
  @HttpCode(204)
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.membersService.remove(workspaceId, userId);
  }
}
