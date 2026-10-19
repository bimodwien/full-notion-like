'use client';

import { useState } from 'react';
import { requestErrorMessage } from '@/helper/request.error';
import { focusFirstInvalid } from '@/util/form.focus';

export const WORKSPACE_NAME_MAX = 100;

// Shared by "create" and "rename": read the name field, require it, then hand it to `submit`.
export function useWorkspaceNameForm(submit: (name: string) => Promise<void>) {
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = String(new FormData(form).get('name') ?? '').trim();
    const found: Record<string, string> = name ? {} : { name: 'Give the workspace a name.' };
    setError(found.name ?? '');
    setFormError('');
    if (focusFirstInvalid(form, found)) return;

    setPending(true);
    try {
      await submit(name);
    } catch (caught) {
      setFormError(requestErrorMessage(caught));
    } finally {
      setPending(false);
    }
  }

  return { error, formError, pending, handleSubmit };
}
