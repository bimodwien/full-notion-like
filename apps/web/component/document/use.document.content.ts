'use client';

import { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { getDocumentContent } from '@/helper/document.api';

export type DocumentContentState =
  { kind: 'loading' } | { kind: 'error' } | { kind: 'ready'; ydoc: Y.Doc };

export function useDocumentContent(workspaceId: string, documentId: string) {
  const [state, setState] = useState<DocumentContentState>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    const ydoc = new Y.Doc();
    getDocumentContent(workspaceId, documentId)
      .then((saved) => {
        if (!active) return;
        if (saved) Y.applyUpdate(ydoc, saved);
        setState({ kind: 'ready', ydoc });
      })
      .catch(() => {
        if (active) setState({ kind: 'error' });
      });
    return () => {
      active = false;
      ydoc.destroy();
    };
  }, [workspaceId, documentId, attempt]);

  function retry() {
    setState({ kind: 'loading' });
    setAttempt((count) => count + 1);
  }

  return { state, retry };
}
