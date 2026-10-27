import { api } from '@/lib/axios';
import { WorkspaceDocument } from '@/model/document.model';
import { base64ToBytes, bytesToBase64 } from '@/util/base64';

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
  changes: { title?: string; parentId?: string | null },
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

export async function getDocumentContent(workspaceId: string, documentId: string) {
  const { data } = await api.get<{ state: string | null }>(
    `${documentPath(workspaceId, documentId)}/content`,
  );
  return data.state ? base64ToBytes(data.state) : null;
}

export async function saveDocumentContent(
  workspaceId: string,
  documentId: string,
  state: Uint8Array,
) {
  await api.put(`${documentPath(workspaceId, documentId)}/content`, {
    state: bytesToBase64(state),
  });
}
