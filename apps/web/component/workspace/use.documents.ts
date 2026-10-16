'use client';

import { useEffect, useState } from 'react';
import { getDocuments } from '@/helper/document.api';
import { WorkspaceDocument } from '@/model/document.model';

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

  return { state, retry };
}
