'use client';

import { createContext, useContext } from 'react';
import { useWorkspaces } from '@/component/workspace/use.workspaces';

const WorkspacesContext = createContext<ReturnType<typeof useWorkspaces> | null>(null);

// Shared by the switcher and the settings page, so a rename shows up in both.
export function WorkspacesProvider({ children }: { children: React.ReactNode }) {
  const workspaces = useWorkspaces();
  return <WorkspacesContext value={workspaces}>{children}</WorkspacesContext>;
}

export function useWorkspacesContext() {
  const value = useContext(WorkspacesContext);
  if (!value) throw new Error('useWorkspacesContext must be used inside WorkspacesProvider');
  return value;
}
