'use client';

import { useId, useRef, useState } from 'react';
import { MENU_ROW, MENU_SURFACE } from '@/component/ui/menu.styles';
import { useDismiss } from '@/component/ui/use.dismiss';
import { useWorkspaceAccess } from '@/component/workspace/workspace.access.context';
import { DeleteTaskDialog } from '@/component/task/delete.task.dialog';
import { Task, TaskStatus } from '@/model/task.model';
import { STATUSES, STATUS_LABEL } from '@/util/task.board';

const TRIGGER =
  '-my-3 -mr-2 grid h-11 w-9 shrink-0 cursor-pointer place-items-center rounded-sm text-ink-muted hover:bg-black/5 hover:text-ink aria-expanded:bg-black/5 aria-expanded:text-ink';

// The card is gone after a delete: focus its board column, or the page's Tasks heading.
function focusAfterDelete(status: TaskStatus) {
  const column = document.getElementById(`column-${status}`);
  (column ?? document.getElementById('page-tasks-heading'))?.focus();
}

type MenuProps = {
  id: string;
  task: Task;
  onChangeStatus: (to: TaskStatus) => void;
  onDelete: () => void;
};

function TaskActionsMenu({ id, task, onChangeStatus, onDelete }: MenuProps) {
  const labelId = useId();
  const targets = STATUSES.filter((status) => status !== task.status);
  return (
    <div id={id} className={`absolute top-8 right-0 w-52 ${MENU_SURFACE}`}>
      <div role="group" aria-labelledby={labelId}>
        <p id={labelId} className="px-2 py-1 text-xs text-ink-muted">
          Move to
        </p>
        {targets.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onChangeStatus(status)}
            className={MENU_ROW}
          >
            {STATUS_LABEL[status]}
          </button>
        ))}
      </div>
      <div className="my-1 border-t border-hairline" />
      <button type="button" onClick={onDelete} className={MENU_ROW}>
        Delete
      </button>
    </div>
  );
}

type Props = { task: Task; onChangeStatus: (to: TaskStatus) => void };

export function TaskActions({ task, onChangeStatus }: Props) {
  const { canEdit } = useWorkspaceAccess();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  useDismiss(open, setOpen, { root, trigger });
  if (!canEdit) return null;

  function changeStatus(to: TaskStatus) {
    setOpen(false);
    trigger.current?.focus();
    onChangeStatus(to);
  }

  function closeDialog() {
    setDeleting(false);
    trigger.current?.focus();
  }

  return (
    <div ref={root} className="relative">
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`More actions for ${task.title}`}
        data-task-actions={task.id}
        className={TRIGGER}
      >
        <span aria-hidden="true">⋯</span>
      </button>
      {open && (
        <TaskActionsMenu
          id={menuId}
          task={task}
          onChangeStatus={changeStatus}
          onDelete={() => {
            setOpen(false);
            setDeleting(true);
          }}
        />
      )}
      {deleting && (
        <DeleteTaskDialog
          task={task}
          onClose={closeDialog}
          onDeleted={() => focusAfterDelete(task.status)}
        />
      )}
    </div>
  );
}
