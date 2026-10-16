export type WorkspaceRole = 'OWNER' | 'EDITOR' | 'VIEWER';

export type Workspace = {
  id: string;
  name: string;
  createdAt: string;
  members: { role: WorkspaceRole }[];
};
