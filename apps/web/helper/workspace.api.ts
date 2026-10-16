import { api } from '@/lib/axios';
import { Workspace } from '@/model/workspace.model';

export async function getWorkspaces() {
  const { data } = await api.get<Workspace[]>('/workspaces');
  return data;
}
