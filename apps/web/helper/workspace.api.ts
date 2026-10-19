import { api } from '@/lib/axios';
import { Workspace } from '@/model/workspace.model';

export async function getWorkspaces() {
  const { data } = await api.get<Workspace[]>('/workspaces');
  return data;
}

export async function createWorkspace(name: string) {
  const { data } = await api.post<Omit<Workspace, 'members'>>('/workspaces', { name });
  // POST returns the bare workspace; whoever creates it is its owner.
  const workspace: Workspace = { ...data, members: [{ role: 'OWNER' }] };
  return workspace;
}

export async function renameWorkspace(workspaceId: string, name: string) {
  await api.patch(`/workspaces/${workspaceId}`, { name });
}

export async function deleteWorkspace(workspaceId: string) {
  await api.delete(`/workspaces/${workspaceId}`);
}
