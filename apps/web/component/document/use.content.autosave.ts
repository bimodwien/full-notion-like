'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import * as Y from 'yjs';
import { saveDocumentContent } from '@/helper/document.api';

const SAVE_DELAY_MS = 1000;

export function useContentAutosave(workspaceId: string, documentId: string, ydoc: Y.Doc | null) {
  useEffect(() => {
    if (!ydoc) return;
    const doc = ydoc;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let dirty = false;

    function save() {
      clearTimeout(timer);
      if (!dirty) return;
      dirty = false;
      saveDocumentContent(workspaceId, documentId, Y.encodeStateAsUpdate(doc)).catch(() => {
        dirty = true;
        toast("Couldn't save this page. Check your connection.", {
          action: { label: 'Try again', onClick: save },
        });
      });
    }

    function scheduleSave() {
      dirty = true;
      clearTimeout(timer);
      timer = setTimeout(save, SAVE_DELAY_MS);
    }

    function saveWhenHidden() {
      if (document.visibilityState === 'hidden') save();
    }

    doc.on('update', scheduleSave);
    document.addEventListener('visibilitychange', saveWhenHidden);
    return () => {
      doc.off('update', scheduleSave);
      document.removeEventListener('visibilitychange', saveWhenHidden);
      save();
    };
  }, [workspaceId, documentId, ydoc]);
}
