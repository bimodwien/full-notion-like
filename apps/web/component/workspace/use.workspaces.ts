'use client';

import { useEffect, useState } from 'react';
import { getWorkspaces } from '@/helper/workspace.api';
import { Workspace } from '@/model/workspace.model';

export type WorkspacesState =
  { kind: 'loading' } | { kind: 'error' } | { kind: 'ready'; workspaces: Workspace[] };

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

  return { state, retry };
}
