'use client';

import { isAxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';
import { useWorkspaceDocuments } from '@/component/document/documents.context';
import { useWorkspaceTasks } from '@/component/task/tasks.context';
import { requestErrorMessage } from '@/helper/request.error';
import { updateTask } from '@/helper/task.api';
import { Task } from '@/model/task.model';
import { focusFirstInvalid } from '@/util/form.focus';
import { taskChanges } from '@/util/task.changes';

function saveErrorMessage(caught: unknown) {
  if (isAxiosError(caught) && caught.response?.status === 404) {
    return 'This task no longer exists. Someone may have deleted it.';
  }
  return requestErrorMessage(caught);
}

export function useTaskDetailForm(task: Task, onDone: () => void) {
  const { workspaceId } = useWorkspaceDocuments();
  const { replace } = useWorkspaceTasks();
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const changes = taskChanges(task, new FormData(form));
    const found: Record<string, string> =
      changes.title === '' ? { title: 'Give the task a title.' } : {};
    setError(found.title ?? '');
    setFormError('');
    if (focusFirstInvalid(form, found)) return;
    if (Object.keys(changes).length === 0) return onDone();

    setPending(true);
    try {
      replace(await updateTask(workspaceId, task.id, changes));
      toast('Task saved.');
      onDone();
    } catch (caught) {
      setFormError(saveErrorMessage(caught));
      setPending(false);
    }
  }

  return { error, formError, pending, handleSubmit };
}
