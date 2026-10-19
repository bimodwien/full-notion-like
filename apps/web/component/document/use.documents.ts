'use client';

import { useEffect, useState } from 'react';
import { getDocuments } from '@/helper/document.api';
import { WorkspaceDocument } from '@/model/document.model';

export type DocumentsState =
  { kind: 'loading' } | { kind: 'error' } | { kind: 'ready'; documents: WorkspaceDocument[] };

// The API deletes child pages with their parent, so the list drops the whole subtree too.
function withoutSubtree(documents: WorkspaceDocument[], rootId: string) {
  const removed = new Set([rootId]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const doc of documents) {
      if (doc.parentId && removed.has(doc.parentId) && !removed.has(doc.id)) {
        removed.add(doc.id);
        grew = true;
      }
    }
  }
  return documents.filter((doc) => !removed.has(doc.id));
}

export function useDocuments(workspaceId: string) {
  const [state, setState] = useState<DocumentsState>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getDocuments(workspaceId)
      .then((documents) => {
        if (active) setState({ kind: 'ready', documents });
      })
      .catch(() => {
        if (active) setState({ kind: 'error' });
      });
    return () => {
      active = false;
    };
  }, [workspaceId, attempt]);

  function retry() {
    setState({ kind: 'loading' });
    setAttempt((count) => count + 1);
  }

  function updateList(change: (documents: WorkspaceDocument[]) => WorkspaceDocument[]) {
    setState((current) =>
      current.kind === 'ready' ? { kind: 'ready', documents: change(current.documents) } : current,
    );
  }

  function add(document: WorkspaceDocument) {
    updateList((documents) => [...documents, document]);
  }

  function rename(documentId: string, title: string) {
    updateList((documents) =>
      documents.map((doc) => (doc.id === documentId ? { ...doc, title } : doc)),
    );
  }

  function remove(documentId: string) {
    updateList((documents) => withoutSubtree(documents, documentId));
  }

  return { state, retry, add, rename, remove };
}
