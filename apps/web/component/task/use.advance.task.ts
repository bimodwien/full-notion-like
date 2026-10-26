'use client';

import { useState } from 'react';
import { flushSync } from 'react-dom';
import { toast } from 'sonner';
import { useWorkspaceDocuments } from '@/component/document/documents.context';
import { useWorkspaceTasks } from '@/component/task/tasks.context';
import { changeTaskStatus } from '@/helper/task.api';
import { Task, TaskStatus } from '@/model/task.model';
import { STATUS_LABEL } from '@/util/task.board';

// The card lands in another column: focus its ⋯ there, or the card itself when it has no menu.
function focusCard(taskId: string) {
  const actions = document.querySelector<HTMLElement>(`[data-task-actions="${taskId}"]`);
  const card = document.querySelector<HTMLElement>(`[data-task-card="${taskId}"]`);
  (actions ?? card)?.focus();
}

export function useAdvanceTask(task: Task) {
  const { workspaceId } = useWorkspaceDocuments();
  const { replace } = useWorkspaceTasks();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function advance(to: TaskStatus) {
    if (busy) return;
    setBusy(true);
    setFailed(false);
    try {
      const updated = await changeTaskStatus(workspaceId, task.id, to);
      toast(`Moved to ${STATUS_LABEL[to]}.`);
      flushSync(() => replace(updated));
      focusCard(task.id);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return { failed, advance };
}
