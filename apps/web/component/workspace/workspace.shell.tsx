'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DocumentList } from '@/component/workspace/document.list';
import { ProfileButton } from '@/component/workspace/profile.button';
import { useWorkspaces, WorkspacesState } from '@/component/workspace/use.workspaces';
import { WorkspaceSwitcher } from '@/component/workspace/workspace.switcher';
import { saveLastWorkspace } from '@/util/last.workspace';

function workspaceLabel(state: WorkspacesState, id: string) {
  if (state.kind === 'loading') return 'Loading…';
  if (state.kind === 'error') return "Couldn't load this workspace";
  return state.workspaces.find((workspace) => workspace.id === id)?.name ?? 'Workspace not found';
}

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { state, retry } = useWorkspaces();
  const found = state.kind === 'ready' && state.workspaces.some(({ id }) => id === workspaceId);

  useEffect(() => {
    if (found) saveLastWorkspace(workspaceId);
  }, [found, workspaceId]);

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="flex flex-col gap-1 border-b border-hairline bg-canvas-soft p-3 md:sticky md:top-0 md:h-dvh md:w-60 md:shrink-0 md:border-r md:border-b-0">
        <WorkspaceSwitcher
          label={workspaceLabel(state, workspaceId)}
          state={state}
          currentId={workspaceId}
          onRetry={retry}
        />
        <DocumentList workspaceId={workspaceId} />
        <ProfileButton />
      </aside>
      <main className="min-w-0 flex-1 bg-canvas px-4 py-10 sm:px-12">{children}</main>
    </div>
  );
}
