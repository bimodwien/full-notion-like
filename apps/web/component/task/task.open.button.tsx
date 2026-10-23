'use client';

import { useRef, useState } from 'react';
import { TaskDetailDialog } from '@/component/task/task.detail.dialog';
import { Task } from '@/model/task.model';

// The ::after layer stretches the click target over the whole card; the ⋯ menu sits above it.
const TITLE_BUTTON =
  "min-w-0 flex-1 cursor-pointer text-left text-body-sm wrap-break-word text-ink after:absolute after:inset-0 after:rounded-sm after:content-['']";

export function TaskOpenButton({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={TITLE_BUTTON}
      >
        {task.title}
      </button>
      {open && <TaskDetailDialog task={task} onClose={close} />}
    </>
  );
}
