import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../generated/prisma/enums';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, name: string) {
    return this.prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: { name },
      });

      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId,
          role: Role.OWNER,
        },
      });

      return workspace;
    });
  }
}
