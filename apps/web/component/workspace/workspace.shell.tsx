'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DocumentsProvider } from '@/component/workspace/documents.context';
import { MobileTopBar } from '@/component/workspace/mobile.top.bar';
import { useSidebarDrawer } from '@/component/workspace/use.sidebar.drawer';
import { findWorkspace, WorkspacesState } from '@/component/workspace/use.workspaces';
import { WorkspaceSidebar } from '@/component/workspace/workspace.sidebar';
import { WorkspaceSwitcher } from '@/component/workspace/workspace.switcher';
import { useWorkspacesContext, WorkspacesProvider } from '@/component/workspace/workspaces.context';
import { saveLastWorkspace } from '@/util/last.workspace';

function workspaceLabel(state: WorkspacesState, id: string) {
  if (state.kind === 'loading') return 'Loading…';
  if (state.kind === 'error') return "Couldn't load this workspace";
  return findWorkspace(state, id)?.name ?? 'Workspace not found';
}

function useCurrentWorkspace(workspaceId: string) {
  const { state, retry } = useWorkspacesContext();
  const current = findWorkspace(state, workspaceId);
  const found = current !== undefined;
  const role = current?.members[0]?.role;

  useEffect(() => {
    if (found) saveLastWorkspace(workspaceId);
  }, [found, workspaceId]);

  return { state, retry, role, canEdit: found && role !== 'VIEWER' };
}

function ShellFrame({ children }: { children: React.ReactNode }) {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { state, retry, role, canEdit } = useCurrentWorkspace(workspaceId);
  const drawer = useSidebarDrawer();
  const label = workspaceLabel(state, workspaceId);
  const switcher = (
    <WorkspaceSwitcher
      label={label}
      state={state}
      currentId={workspaceId}
      isOwner={role === 'OWNER'}
      onRetry={retry}
    />
  );

  return (
    <DocumentsProvider key={workspaceId} workspaceId={workspaceId} canEdit={canEdit}>
      <div className="flex flex-1 flex-col md:flex-row">
        <MobileTopBar
          workspaceLabel={label}
          open={drawer.open}
          onOpen={drawer.show}
          buttonRef={drawer.menuButton}
        />
        <WorkspaceSidebar
          switcher={switcher}
          open={drawer.open}
          onClose={drawer.close}
          closeButtonRef={drawer.closeButton}
        />
        {/* Inert while the drawer covers it, so Tab stays inside the drawer. */}
        <main inert={drawer.open} className="min-w-0 flex-1 bg-canvas px-4 py-8 sm:px-12 md:py-10">
          {children}
        </main>
      </div>
    </DocumentsProvider>
  );
}

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  return (
    <WorkspacesProvider>
      <ShellFrame>{children}</ShellFrame>
    </WorkspacesProvider>
  );
}
