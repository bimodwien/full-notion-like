import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(
    workspaceId: string,
    userId: string,
    title?: string,
    parentId?: string,
  ) {
    if (parentId) await this.findInWorkspace(workspaceId, parentId, true);
    return this.prisma.document.create({
      data: { workspaceId, createdById: userId, title, parentId },
    });
  }

  list(workspaceId: string) {
    return this.prisma.document.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'asc' },
    });
  }

  findOne(workspaceId: string, documentId: string) {
    return this.findInWorkspace(workspaceId, documentId);
  }

  async update(
    workspaceId: string,
    documentId: string,
    title?: string,
    parentId?: string | null,
  ) {
    await this.findInWorkspace(workspaceId, documentId);
    if (parentId)
      await this.assertValidParent(workspaceId, documentId, parentId);
    return this.prisma.document.update({
      where: { id: documentId },
      data: { title, parentId },
    });
  }

  async remove(workspaceId: string, documentId: string) {
    await this.findInWorkspace(workspaceId, documentId);
    await this.prisma.document.delete({ where: { id: documentId } });
  }

  private async findInWorkspace(
    workspaceId: string,
    documentId: string,
    asParent = false,
  ) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, workspaceId },
    });
    if (document) return document;
    if (asParent) throw new BadRequestException('Parent document not found');
    throw new NotFoundException();
  }

  private async assertValidParent(
    workspaceId: string,
    documentId: string,
    parentId: string,
  ) {
    await this.findInWorkspace(workspaceId, parentId, true);
    let currentId: string | null = parentId;
    while (currentId) {
      if (currentId === documentId) {
        throw new BadRequestException('Cannot move a document into itself');
      }
      const current: { parentId: string | null } | null =
        await this.prisma.document.findUnique({
          where: { id: currentId },
          select: { parentId: true },
        });
      currentId = current?.parentId ?? null;
    }
  }
}
