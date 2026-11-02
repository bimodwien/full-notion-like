'use client';

import { useCallback } from 'react';
import { LoadedList, useLoadedList } from '@/component/ui/use.loaded.list';
import { getDocuments } from '@/helper/document.api';
import { WorkspaceDocument } from '@/model/document.model';
import { subtreeIds } from '@/util/document.tree';

export type DocumentsState = LoadedList<WorkspaceDocument>;

export function useDocuments(workspaceId: string) {
  const load = useCallback(() => getDocuments(workspaceId), [workspaceId]);
  const { state, retry, updateList } = useLoadedList(load);

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
