'use client';

import { useRef, useState } from 'react';
import { buttonStyles } from '@/component/ui/button.styles';
import { DIALOG_PANEL } from '@/component/ui/dialog.styles';
import { FormAlert } from '@/component/ui/form.alert';
import { TextField } from '@/component/ui/text.field';
import { useShowModal } from '@/component/ui/use.show.modal';
import { PriorityField } from '@/component/task/priority.field';
import { requestErrorMessage } from '@/helper/request.error';
import { createTask } from '@/helper/task.api';
import { Task, TaskPriority } from '@/model/task.model';
import { focusFirstInvalid } from '@/util/form.focus';

const TITLE_MAX = 200;

function readForm(form: HTMLFormElement) {
  const data = new FormData(form);
  return {
    title: String(data.get('title') ?? '').trim(),
    priority: data.get('priority') as TaskPriority,
  };
}

function useNewTaskForm(
  workspaceId: string,
  documentId: string | undefined,
  onCreated: (task: Task) => void,
) {
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = readForm(form);
    const found: Record<string, string> = input.title ? {} : { title: 'Give the task a title.' };
    setError(found.title ?? '');
    setFormError('');
    if (focusFirstInvalid(form, found)) return;

    setPending(true);
    try {
      onCreated(await createTask(workspaceId, { ...input, documentId }));
    } catch (caught) {
      setFormError(requestErrorMessage(caught));
      setPending(false);
    }
  }

  return { error, formError, pending, handleSubmit };
}

type Props = {
  workspaceId: string;
  documentId?: string;
  onCreated: (task: Task) => void;
  onClose: () => void;
};

export function NewTaskDialog({ workspaceId, documentId, onCreated, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const { error, formError, pending, handleSubmit } = useNewTaskForm(
    workspaceId,
    documentId,
    (task) => {
      onCreated(task);
      ref.current?.close();
    },
  );
  useShowModal(ref);

  return (
    <dialog ref={ref} aria-labelledby="new-task-heading" onClose={onClose} className={DIALOG_PANEL}>
      <h2 id="new-task-heading" className="mb-4 text-h3">
        New task
      </h2>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <TextField
          label="Title"
          name="title"
          autoComplete="off"
          maxLength={TITLE_MAX}
          error={error}
        />
        <PriorityField />
        <FormAlert message={formError} />
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className={buttonStyles('utility')}
          >
            Cancel
          </button>
          <button type="submit" disabled={pending} className={buttonStyles('primary')}>
            {pending ? 'Creating…' : 'Create task'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
