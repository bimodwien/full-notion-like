'use client';

import { useEffect, useState } from 'react';
import { getWorkspaces } from '@/helper/workspace.api';
import { Workspace } from '@/model/workspace.model';

export type WorkspacesState =
  { kind: 'loading' } | { kind: 'error' } | { kind: 'ready'; workspaces: Workspace[] };

export function findWorkspace(state: WorkspacesState, workspaceId: string) {
  return state.kind === 'ready' ? state.workspaces.find(({ id }) => id === workspaceId) : undefined;
}

export function useWorkspaces() {
  const [state, setState] = useState<WorkspacesState>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getWorkspaces()
      .then((workspaces) => {
        if (active) setState({ kind: 'ready', workspaces });
      })
      .catch(() => {
        if (active) setState({ kind: 'error' });
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  function retry() {
    setState({ kind: 'loading' });
    setAttempt((count) => count + 1);
  }

  function updateList(change: (workspaces: Workspace[]) => Workspace[]) {
    setState((current) =>
      current.kind === 'ready'
        ? { kind: 'ready', workspaces: change(current.workspaces) }
        : current,
    );
  }

  // Newest first, matching the API's order.
  function add(workspace: Workspace) {
    updateList((workspaces) => [workspace, ...workspaces]);
  }

  function rename(workspaceId: string, name: string) {
    updateList((workspaces) =>
      workspaces.map((workspace) =>
        workspace.id === workspaceId ? { ...workspace, name } : workspace,
      ),
    );
  }

  function remove(workspaceId: string) {
    updateList((workspaces) => workspaces.filter(({ id }) => id !== workspaceId));
  }

  return { state, retry, add, rename, remove };
}
