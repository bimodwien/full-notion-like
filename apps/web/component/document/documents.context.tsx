'use client';

import { createContext, useContext } from 'react';
import { useDocuments } from '@/component/document/use.documents';

const DocumentsContext = createContext<ReturnType<typeof useDocuments> | null>(null);

type ProviderProps = { workspaceId: string; children: React.ReactNode };

// One list for the sidebar and the open page, so a rename or delete shows up in both.
export function DocumentsProvider({ workspaceId, children }: ProviderProps) {
  const documents = useDocuments(workspaceId);
  return <DocumentsContext value={documents}>{children}</DocumentsContext>;
}

export function useWorkspaceDocuments() {
  const value = useContext(DocumentsContext);
  if (!value) throw new Error('useWorkspaceDocuments must be used inside DocumentsProvider');
  return value;
}
