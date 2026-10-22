'use client';

import { isAxiosError } from 'axios';
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { toast } from 'sonner';
import { buttonStyles } from '@/component/ui/button.styles';
import { DIALOG_PANEL } from '@/component/ui/dialog.styles';
import { useShowModal } from '@/component/ui/use.show.modal';
import { useWorkspaceDocuments } from '@/component/document/documents.context';
import { useWorkspaceTasks } from '@/component/task/tasks.context';
import { deleteTask } from '@/helper/task.api';
import { Task } from '@/model/task.model';

type Props = {
  task: Task;
  onClose: () => void;
  // Called once the card, and the ⋯ button that opened this dialog, are gone.
  onDeleted: () => void;
};

function useDeleteTask(task: Task, onDeleted: () => void) {
  const { workspaceId } = useWorkspaceDocuments();
  const { remove } = useWorkspaceTasks();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function confirmDelete(dialog: HTMLDialogElement | null) {
    setBusy(true);
    setFailed(false);
    try {
      await deleteTask(workspaceId, task.id);
    } catch (caught) {
      // 404: someone else already deleted it, which is the outcome the user asked for.
      if (!isAxiosError(caught) || caught.response?.status !== 404) {
        setFailed(true);
        setBusy(false);
        return;
      }
    }
    toast('Task deleted.');
    dialog?.close();
    // Unmount the card before the dialog's close event can send focus back to it.
    flushSync(() => remove(task.id));
    onDeleted();
  }

  return { busy, failed, confirmDelete };
}

// Mounted only while open, so a board full of cards doesn't carry a dialog per card.
export function DeleteTaskDialog({ task, onClose, onDeleted }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const { busy, failed, confirmDelete } = useDeleteTask(task, onDeleted);
  useShowModal(ref);

  return (
    <dialog
      ref={ref}
      aria-labelledby="delete-task-heading"
      onClose={onClose}
      className={DIALOG_PANEL}
    >
      <h2 id="delete-task-heading" className="text-h3">
        Delete this task?
      </h2>
      <p className="mt-2 text-base wrap-break-word text-ink-muted">
        &ldquo;{task.title}&rdquo; will be deleted. This can&apos;t be undone.
      </p>
      {failed && (
        <p role="alert" className="mt-3 text-body-sm text-error">
          Couldn&apos;t delete the task. Try again.
        </p>
      )}
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          className={buttonStyles('utility')}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => confirmDelete(ref.current)}
          disabled={busy}
          className={buttonStyles('danger')}
        >
          {busy ? 'Deleting…' : 'Delete task'}
        </button>
      </div>
    </dialog>
  );
}
