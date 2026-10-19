import { WorkspaceDocument } from '@/model/document.model';

export function childrenOf(documents: WorkspaceDocument[], parentId: string | null) {
  return documents.filter((doc) => doc.parentId === parentId);
}

// Every page above documentId, so the sidebar can open the path down to it.
export function ancestorIds(documents: WorkspaceDocument[], documentId: string | undefined) {
  const byId = new Map(documents.map((doc) => [doc.id, doc]));
  const ids = new Set<string>();
  let parentId = documentId ? (byId.get(documentId)?.parentId ?? null) : null;
  while (parentId && !ids.has(parentId)) {
    ids.add(parentId);
    parentId = byId.get(parentId)?.parentId ?? null;
  }
  return ids;
}
