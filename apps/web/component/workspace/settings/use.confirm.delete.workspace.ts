'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { toast } from 'sonner';
import { useWorkspacesContext } from '@/component/workspace/workspaces.context';
import { requestErrorMessage } from '@/helper/request.error';
import { deleteWorkspace } from '@/helper/workspace.api';
import { Workspace } from '@/model/workspace.model';

function useDeleteWorkspace(workspace: Workspace) {
  const router = useRouter();
  const { state, remove } = useWorkspacesContext();

  return async function deleteAndLeave() {
    await deleteWorkspace(workspace.id);
    const next =
      state.kind === 'ready' ? state.items.find(({ id }) => id !== workspace.id) : undefined;
    toast('Workspace deleted.');
    // Same transition, so this page never renders "doesn't exist" on the way out.
    startTransition(() => {
      router.replace(next ? `/workspaces/${next.id}` : '/workspaces');
      remove(workspace.id);
    });
  };
}

// Nothing is deleted until the typed text matches the workspace name.
export function useConfirmDelete(workspace: Workspace) {
  const deleteAndLeave = useDeleteWorkspace(workspace);
  const [typed, setTyped] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  function type(value: string) {
    setTyped(value);
    setFieldError('');
  }

  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    if (typed.trim() !== workspace.name.trim()) {
      setFieldError('Type the workspace name exactly as shown.');
      return;
    }
    setFieldError('');
    setBusy(true);
    try {
      await deleteAndLeave();
    } catch (caught) {
      setFormError(requestErrorMessage(caught));
      setBusy(false);
    }
  }

  return { typed, fieldError, formError, busy, type, submit };
}
