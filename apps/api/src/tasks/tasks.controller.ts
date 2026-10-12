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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import type { AuthenticatedRequest } from '../auth/authenticated.request';
import { WorkspaceMemberGuard } from '../workspaces/workspaces.member.guard';
import { RolesGuard } from '../workspaces/roles.guard';
import { Roles } from '../workspaces/roles.decorator';
import { Role } from '../generated/prisma/enums';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { UpdateTaskStatusDto } from './dto/update.task.status.dto';
import { ListTasksQueryDto } from './dto/list.tasks.query.dto';

@UseGuards(JwtAuthGuard, WorkspaceMemberGuard, RolesGuard)
@Controller('workspaces/:workspaceId/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Roles(Role.OWNER, Role.EDITOR)
  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId') workspaceId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(workspaceId, req.user!.id, dto);
  }

  @Get()
  list(
    @Param('workspaceId') workspaceId: string,
    @Query() query: ListTasksQueryDto,
  ) {
    return this.tasksService.list(workspaceId, query);
  }

  @Get(':taskId')
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ) {
    return this.tasksService.findOne(workspaceId, taskId);
  }

  @Roles(Role.OWNER, Role.EDITOR)
  @Patch(':taskId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(workspaceId, taskId, dto);
  }

  @Roles(Role.OWNER, Role.EDITOR)
  @Patch(':taskId/status')
  changeStatus(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    return this.tasksService.changeStatus(workspaceId, taskId, dto.status);
  }

  @Roles(Role.OWNER, Role.EDITOR)
  @Delete(':taskId')
  @HttpCode(204)
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ) {
    return this.tasksService.remove(workspaceId, taskId);
  }
}
