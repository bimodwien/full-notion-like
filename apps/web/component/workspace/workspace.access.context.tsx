'use client';

import { createContext, useContext } from 'react';

type WorkspaceAccess = {
  workspaceId: string;
  canEdit: boolean;
};

const WorkspaceAccessContext = createContext<WorkspaceAccess | null>(null);

export function WorkspaceAccessProvider({
  workspaceId,
  canEdit,
  children,
}: WorkspaceAccess & { children: React.ReactNode }) {
  return (
    <WorkspaceAccessContext value={{ workspaceId, canEdit }}>{children}</WorkspaceAccessContext>
  );
}

export function useWorkspaceAccess() {
  const value = useContext(WorkspaceAccessContext);
  if (!value) throw new Error('useWorkspaceAccess must be used inside WorkspaceAccessProvider');
  return value;
}
