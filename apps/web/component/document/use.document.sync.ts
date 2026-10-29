'use client';

import { useEffect } from 'react';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

export function useDocumentSync(workspaceId: string, documentId: string, ydoc: Y.Doc | null) {
  useEffect(() => {
    if (!ydoc) return;
    // Tabs would otherwise sync over BroadcastChannel and skip the sync server.
    // The relay keeps no copy, so peers re-ask each other to recover missed edits.
    const provider = new WebsocketProvider(
      `${process.env.NEXT_PUBLIC_SYNC_URL}/ws/${workspaceId}`,
      documentId,
      ydoc,
      { disableBc: true, resyncInterval: 5000 },
    );
    return () => provider.destroy();
  }, [workspaceId, documentId, ydoc]);
}
