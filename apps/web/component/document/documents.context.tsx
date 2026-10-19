'use client';

import { createContext, useContext } from 'react';
import { useDocuments } from '@/component/document/use.documents';

type WorkspaceDocuments = ReturnType<typeof useDocuments> & {
  workspaceId: string;
  canEdit: boolean;
};

const DocumentsContext = createContext<WorkspaceDocuments | null>(null);

type ProviderProps = {
  workspaceId: string;
  canEdit: boolean;
  children: React.ReactNode;
};

// One list for the sidebar and the open page, so a rename or delete shows up in both.
export function DocumentsProvider({ workspaceId, canEdit, children }: ProviderProps) {
  const documents = useDocuments(workspaceId);
  return (
    <DocumentsContext value={{ ...documents, workspaceId, canEdit }}>{children}</DocumentsContext>
  );
}

export function useWorkspaceDocuments() {
  const value = useContext(DocumentsContext);
  if (!value) throw new Error('useWorkspaceDocuments must be used inside DocumentsProvider');
  return value;
}
