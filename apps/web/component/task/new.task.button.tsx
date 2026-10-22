'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { buttonStyles } from '@/component/ui/button.styles';
import { useWorkspaceDocuments } from '@/component/document/documents.context';
import { NewTaskDialog } from '@/component/task/new.task.dialog';
import { Task } from '@/model/task.model';
import { useWorkspaceTasks } from '@/component/task/tasks.context';

export function NewTaskButton() {
  const { workspaceId } = useWorkspaceDocuments();
  const { add } = useWorkspaceTasks();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  function handleCreated(task: Task) {
    add(task);
    toast('Task created.');
  }

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        className={buttonStyles('primary')}
      >
        New task
      </button>
      {open && (
        <NewTaskDialog workspaceId={workspaceId} onCreated={handleCreated} onClose={close} />
      )}
    </>
  );
}
