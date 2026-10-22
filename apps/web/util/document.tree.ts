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

// documentId plus every page nested under it, at any depth.
export function subtreeIds(documents: WorkspaceDocument[], rootId: string) {
  const ids = new Set([rootId]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const doc of documents) {
      if (doc.parentId && ids.has(doc.parentId) && !ids.has(doc.id)) {
        ids.add(doc.id);
        grew = true;
      }
    }
  }
  return ids;
}

export type MoveTarget = { doc: WorkspaceDocument; depth: number };

// Pages in sidebar order with their depth, leaving out the moving page and its own subpages.
export function moveTargets(documents: WorkspaceDocument[], movingId: string) {
  const targets: MoveTarget[] = [];
  function walk(parentId: string | null, depth: number) {
    for (const doc of childrenOf(documents, parentId)) {
      if (doc.id === movingId) continue;
      targets.push({ doc, depth });
      walk(doc.id, depth + 1);
    }
  }
  walk(null, 0);
  return targets;
}
