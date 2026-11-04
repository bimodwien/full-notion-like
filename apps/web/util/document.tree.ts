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

const MAX_PATH = 28;

// "Parent / Child": a page's title with the titles above it, for places that can't draw a tree.
export function pagePath(documents: WorkspaceDocument[], doc: WorkspaceDocument) {
  const byId = new Map(documents.map((page) => [page.id, page]));
  const titles = [doc.title || 'Untitled'];
  const seen = new Set([doc.id]);
  let parent = doc.parentId ? byId.get(doc.parentId) : undefined;
  while (parent && !seen.has(parent.id)) {
    seen.add(parent.id);
    titles.unshift(parent.title || 'Untitled');
    parent = parent.parentId ? byId.get(parent.parentId) : undefined;
  }
  const path = titles.join(' / ');
  if (path.length <= MAX_PATH) return path;
  return `… / ${titles[titles.length - 1]}`;
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

// Pages in sidebar order with their depth, leaving out skipId and its own subpages.
export function pagesInTreeOrder(documents: WorkspaceDocument[], skipId?: string) {
  const pages: MoveTarget[] = [];
  function walk(parentId: string | null, depth: number) {
    for (const doc of childrenOf(documents, parentId)) {
      if (doc.id === skipId) continue;
      pages.push({ doc, depth });
      walk(doc.id, depth + 1);
    }
  }
  walk(null, 0);
  return pages;
}

export function moveTargets(documents: WorkspaceDocument[], movingId: string) {
  return pagesInTreeOrder(documents, movingId);
}
