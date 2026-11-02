'use client';

import { LoadedList, useLoadedList } from '@/component/ui/use.loaded.list';
import { getWorkspaces } from '@/helper/workspace.api';
import { Workspace } from '@/model/workspace.model';

export type WorkspacesState = LoadedList<Workspace>;

export function findWorkspace(state: WorkspacesState, workspaceId: string) {
  return state.kind === 'ready' ? state.items.find(({ id }) => id === workspaceId) : undefined;
}

export function useWorkspaces() {
  const { state, retry, updateList } = useLoadedList(getWorkspaces);

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
