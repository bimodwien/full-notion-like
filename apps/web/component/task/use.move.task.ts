'use client';

import { useRef } from 'react';
import { toast } from 'sonner';
import { useWorkspaceDocuments } from '@/component/document/documents.context';
import { useWorkspaceTasks } from '@/component/task/tasks.context';
import { changeTaskStatus } from '@/helper/task.api';
import { Task, TaskStatus } from '@/model/task.model';
import { STATUS_LABEL } from '@/util/task.board';

// Moves the card right away, then puts it back if the API refuses.
export function useMoveTask() {
  const { workspaceId } = useWorkspaceDocuments();
  const { replace } = useWorkspaceTasks();
  const pending = useRef(new Set<string>());

  async function move(task: Task, to: TaskStatus) {
    if (task.status === to || pending.current.has(task.id)) return;
    pending.current.add(task.id);
    replace({ ...task, status: to });
    try {
      replace(await changeTaskStatus(workspaceId, task.id, to));
    } catch {
      replace(task);
      toast(`Couldn't move "${task.title}" to ${STATUS_LABEL[to]}.`);
    } finally {
      pending.current.delete(task.id);
    }
  }
  return move;
}
