import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '../generated/prisma/enums';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { ListTasksQueryDto } from './dto/list.tasks.query.dto';
import { canTransition } from './tasks.transitions';

interface TaskRefs {
  documentId?: string | null;
  assigneeId?: string | null;
  reviewerId?: string | null;
}

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(workspaceId: string, userId: string, dto: CreateTaskDto) {
    await this.assertRefsInWorkspace(workspaceId, dto);
    return this.prisma.task.create({
      data: { ...dto, workspaceId, createdById: userId },
    });
  }

  list(workspaceId: string, query: ListTasksQueryDto) {
    return this.prisma.task.findMany({
      where: { workspaceId, ...query },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(workspaceId: string, taskId: string) {
    return this.findInWorkspace(workspaceId, taskId);
  }

  async update(workspaceId: string, taskId: string, dto: UpdateTaskDto) {
    await this.findInWorkspace(workspaceId, taskId);
    await this.assertRefsInWorkspace(workspaceId, dto);
    return this.prisma.task.update({ where: { id: taskId }, data: dto });
  }

  async changeStatus(workspaceId: string, taskId: string, next: TaskStatus) {
    const task = await this.findInWorkspace(workspaceId, taskId);
    if (!canTransition(task.status, next)) {
      throw new BadRequestException(
        `Cannot change status from ${task.status} to ${next}`,
      );
    }
    return this.prisma.task.update({
      where: { id: taskId },
      data: { status: next },
    });
  }

  async remove(workspaceId: string, taskId: string) {
    await this.findInWorkspace(workspaceId, taskId);
    await this.prisma.task.delete({ where: { id: taskId } });
  }

  private async findInWorkspace(workspaceId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, workspaceId },
    });
    if (!task) throw new NotFoundException();
    return task;
  }

  private async assertRefsInWorkspace(workspaceId: string, refs: TaskRefs) {
    const { documentId, assigneeId, reviewerId } = refs;
    if (documentId) await this.assertDocument(workspaceId, documentId);
    if (assigneeId) await this.assertMember(workspaceId, assigneeId);
    if (reviewerId) await this.assertMember(workspaceId, reviewerId);
  }

  private async assertDocument(workspaceId: string, documentId: string) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, workspaceId },
      select: { id: true },
    });
    if (!document) throw new BadRequestException('Document not found');
  }

  private async assertMember(workspaceId: string, userId: string) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
      select: { userId: true },
    });
    if (!member) throw new BadRequestException('User is not a member');
  }
}
