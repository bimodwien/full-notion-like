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
import { UpdateTaskStatusDto } from './dto/update.task.status.dto';
import { canTransition } from './tasks.transitions';
import { hasRoom, positionBetween } from './tasks.position';

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
    const position = await this.topPosition(workspaceId, TaskStatus.TODO);
    return this.prisma.task.create({
      data: { ...dto, workspaceId, createdById: userId, position },
    });
  }

  list(workspaceId: string, query: ListTasksQueryDto) {
    return this.prisma.task.findMany({
      where: { workspaceId, ...query },
      orderBy: [{ status: 'asc' }, { position: 'asc' }, { createdAt: 'desc' }],
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

  async changeStatus(
    workspaceId: string,
    taskId: string,
    dto: UpdateTaskStatusDto,
  ) {
    const task = await this.findInWorkspace(workspaceId, taskId);
    const { status, aboveId, belowId } = dto;
    const reorder = Boolean(aboveId || belowId);
    if (status !== task.status && !canTransition(task.status, status)) {
      throw new BadRequestException(
        `Cannot change status from ${task.status} to ${status}`,
      );
    }
    if (status === task.status && !reorder) {
      throw new BadRequestException(`Task is already ${status}`);
    }
    if (aboveId === taskId || belowId === taskId) {
      throw new BadRequestException('A task cannot sit next to itself');
    }
    const position = reorder
      ? await this.positionBetweenTasks(workspaceId, status, aboveId, belowId)
      : await this.topPosition(workspaceId, status);
    return this.prisma.task.update({
      where: { id: taskId },
      data: { status, position },
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

  private async topPosition(workspaceId: string, status: TaskStatus) {
    const { _min } = await this.prisma.task.aggregate({
      where: { workspaceId, status },
      _min: { position: true },
    });
    return positionBetween(undefined, _min.position ?? undefined);
  }

  private async positionBetweenTasks(
    workspaceId: string,
    status: TaskStatus,
    aboveId?: string,
    belowId?: string,
  ) {
    const read = () =>
      Promise.all([
        this.neighborPosition(workspaceId, status, aboveId),
        this.neighborPosition(workspaceId, status, belowId),
      ]);
    let [above, below] = await read();
    if (!hasRoom(above, below)) {
      await this.renumber(workspaceId, status);
      [above, below] = await read();
      if (!hasRoom(above, below)) {
        throw new BadRequestException('Neighbor tasks are out of order');
      }
    }
    return positionBetween(above, below);
  }

  private async neighborPosition(
    workspaceId: string,
    status: TaskStatus,
    id?: string,
  ) {
    if (!id) return undefined;
    const task = await this.prisma.task.findFirst({
      where: { id, workspaceId, status },
      select: { position: true },
    });
    if (!task) {
      throw new BadRequestException('Neighbor task not in that column');
    }
    return task.position;
  }

  // Resets a column to 1, 2, 3... in its current order when midpoints run out of room.
  private async renumber(workspaceId: string, status: TaskStatus) {
    const tasks = await this.prisma.task.findMany({
      where: { workspaceId, status },
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
      select: { id: true },
    });
    await this.prisma.$transaction(
      tasks.map((task, index) =>
        this.prisma.task.update({
          where: { id: task.id },
          data: { position: index + 1 },
        }),
      ),
    );
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
