'use client';

import { useRef } from 'react';
import { buttonStyles } from '@/component/ui/button.styles';
import { DIALOG_PANEL_WIDE } from '@/component/ui/dialog.styles';
import { FormAlert } from '@/component/ui/form.alert';
import { useShowModal } from '@/component/ui/use.show.modal';
import { useWorkspaceAccess } from '@/component/workspace/workspace.access.context';
import { TaskDetailFields } from '@/component/task/task.detail.fields';
import { useTaskDetailForm } from '@/component/task/use.task.detail.form';
import { Task } from '@/model/task.model';
import { STATUS_LABEL } from '@/util/task.board';

type ButtonsProps = { canEdit: boolean; pending: boolean; onClose: () => void };

function DetailButtons({ canEdit, pending, onClose }: ButtonsProps) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <button type="button" onClick={onClose} className={buttonStyles('utility')}>
        {canEdit ? 'Cancel' : 'Close'}
      </button>
      {canEdit && (
        <button type="submit" disabled={pending} className={buttonStyles('primary')}>
          {pending ? 'Saving…' : 'Save changes'}
        </button>
      )}
    </div>
  );
}

type Props = { task: Task; onClose: () => void };

// Viewers get the same dialog with every field disabled and no Save button.
export function TaskDetailDialog({ task, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const { canEdit } = useWorkspaceAccess();
  const form = useTaskDetailForm(task, () => ref.current?.close());
  useShowModal(ref);

  return (
    <dialog
      ref={ref}
      aria-labelledby="task-detail-heading"
      onClose={onClose}
      className={DIALOG_PANEL_WIDE}
    >
      <h2 id="task-detail-heading" className="text-h3">
        {canEdit ? 'Edit task' : 'Task details'}
      </h2>
      <p className="mt-1 mb-4 text-body-sm text-ink-muted">Status: {STATUS_LABEL[task.status]}</p>
      <form onSubmit={form.handleSubmit} noValidate className="flex flex-col gap-4">
        <fieldset disabled={!canEdit} className="flex min-w-0 flex-col gap-4">
          <TaskDetailFields task={task} error={form.error} />
        </fieldset>
        <FormAlert message={form.formError} />
        <DetailButtons
          canEdit={canEdit}
          pending={form.pending}
          onClose={() => ref.current?.close()}
        />
      </form>
    </dialog>
  );
}
