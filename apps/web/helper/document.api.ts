import { api } from '@/lib/axios';
import { WorkspaceDocument } from '@/model/document.model';

function documentPath(workspaceId: string, documentId: string) {
  return `/workspaces/${workspaceId}/documents/${documentId}`;
}

export async function getDocuments(workspaceId: string) {
  const { data } = await api.get<WorkspaceDocument[]>(`/workspaces/${workspaceId}/documents`);
  return data;
}

export async function createDocument(workspaceId: string, parentId: string | null = null) {
  const { data } = await api.post<WorkspaceDocument>(
    `/workspaces/${workspaceId}/documents`,
    parentId ? { parentId } : {},
  );
  return data;
}

export async function updateDocument(
  workspaceId: string,
  documentId: string,
  changes: { title?: string },
) {
  const { data } = await api.patch<WorkspaceDocument>(
    documentPath(workspaceId, documentId),
    changes,
  );
  return data;
}

export async function deleteDocument(workspaceId: string, documentId: string) {
  await api.delete(documentPath(workspaceId, documentId));
}
