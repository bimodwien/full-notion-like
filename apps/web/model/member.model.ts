import { WorkspaceRole } from '@/model/workspace.model';

// Roles the owner can hand out. Ownership itself can't be given away.
export type MemberRole = Exclude<WorkspaceRole, 'OWNER'>;

export type Member = {
  role: WorkspaceRole;
  user: { id: string; name: string; email: string };
};
