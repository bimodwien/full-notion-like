import { api } from '@/lib/axios';
import { WorkspaceDocument } from '@/model/document.model';

export async function getDocuments(workspaceId: string) {
  const { data } = await api.get<WorkspaceDocument[]>(`/workspaces/${workspaceId}/documents`);
  return data;
}
