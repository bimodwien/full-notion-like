import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { isUniqueViolation } from '../prisma/prisma.errors';
import { Role } from '../generated/prisma/enums';

// Every endpoint answers with the same member shape, so the web can drop it straight into its list.
const MEMBER_SELECT = {
  role: true,
  user: { select: { id: true, name: true, email: true } },
} as const;

@Injectable()
export class WorkspaceMembersService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  list(workspaceId: string) {
    return this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      // Postgres sorts enums by declaration order, so the owner comes first.
      orderBy: [{ role: 'asc' }, { user: { name: 'asc' } }],
      select: MEMBER_SELECT,
    });
  }

  async add(workspaceId: string, email: string, role: Role) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    try {
      return await this.prisma.workspaceMember.create({
        data: { workspaceId, userId: user.id, role },
        select: MEMBER_SELECT,
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException('Already a member');
      }
      throw error;
    }
  }

  async updateRole(workspaceId: string, userId: string, role: Role) {
    await this.assertNotOwner(workspaceId, userId);
    return this.prisma.workspaceMember.update({
      where: { workspaceId_userId: { workspaceId, userId } },
      data: { role },
      select: MEMBER_SELECT,
    });
  }

  async remove(workspaceId: string, userId: string) {
    await this.assertNotOwner(workspaceId, userId);
    await this.prisma.workspaceMember.delete({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
  }

  private async assertNotOwner(workspaceId: string, userId: string) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
    if (!member) throw new NotFoundException('Member not found');
    if (member.role === Role.OWNER) {
      throw new BadRequestException('Cannot change or remove the owner');
    }
  }
}
