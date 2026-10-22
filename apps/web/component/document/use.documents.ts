'use client';

import { useEffect, useState } from 'react';
import { getDocuments } from '@/helper/document.api';
import { WorkspaceDocument } from '@/model/document.model';
import { subtreeIds } from '@/util/document.tree';

export type DocumentsState =
  { kind: 'loading' } | { kind: 'error' } | { kind: 'ready'; documents: WorkspaceDocument[] };

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

  function move(documentId: string, parentId: string | null) {
    updateList((documents) =>
      documents.map((doc) => (doc.id === documentId ? { ...doc, parentId } : doc)),
    );
  }

  // The API deletes child pages with their parent, so the list drops the whole subtree too.
  function remove(documentId: string) {
    updateList((documents) => {
      const gone = subtreeIds(documents, documentId);
      return documents.filter((doc) => !gone.has(doc.id));
    });
  }

  return { state, retry, add, rename, move, remove };
}
