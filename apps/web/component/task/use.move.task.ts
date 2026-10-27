'use client';

import { useRef } from 'react';
import { toast } from 'sonner';
import { useWorkspaceDocuments } from '@/component/document/documents.context';
import { useWorkspaceTasks } from '@/component/task/tasks.context';
import { changeTaskStatus } from '@/helper/task.api';
import { Task } from '@/model/task.model';
import { Drop } from '@/util/task.drop';

// Moves the card right away, then puts it back if the API refuses.
export function useMoveTask() {
  const { workspaceId } = useWorkspaceDocuments();
  const { replace } = useWorkspaceTasks();
  const pending = useRef(new Set<string>());

  async function move(task: Task, { status, position, place }: Drop) {
    if (pending.current.has(task.id)) return;
    pending.current.add(task.id);
    replace({ ...task, status, position });
    try {
      replace(await changeTaskStatus(workspaceId, task.id, status, place));
    } catch {
      replace(task);
      toast(`Couldn't move "${task.title}".`);
    } finally {
      pending.current.delete(task.id);
    }
  }

  return move;
}
