'use client';

import { useEffect, useState } from 'react';
import { getTasks } from '@/helper/task.api';
import { Task } from '@/model/task.model';

export type TasksState = { kind: 'loading' } | { kind: 'error' } | { kind: 'ready'; tasks: Task[] };

export function useTasks(workspaceId: string, documentId?: string) {
  const [state, setState] = useState<TasksState>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getTasks(workspaceId, documentId)
      .then((tasks) => {
        if (active) setState({ kind: 'ready', tasks });
      })
      .catch(() => {
        if (active) setState({ kind: 'error' });
      });
    return () => {
      active = false;
    };
  }, [workspaceId, documentId, attempt]);

  function retry() {
    setState({ kind: 'loading' });
    setAttempt((count) => count + 1);
  }

  function updateList(change: (tasks: Task[]) => Task[]) {
    setState((current) =>
      current.kind === 'ready' ? { kind: 'ready', tasks: change(current.tasks) } : current,
    );
  }

  function add(task: Task) {
    updateList((tasks) => [task, ...tasks]);
  }

  // On a page's task list, a task moved to another page drops out of the list.
  function replace(updated: Task) {
    if (documentId && updated.documentId !== documentId) {
      remove(updated.id);
      return;
    }
    updateList((tasks) => tasks.map((task) => (task.id === updated.id ? updated : task)));
  }

  function remove(taskId: string) {
    updateList((tasks) => tasks.filter((task) => task.id !== taskId));
  }

  return { state, retry, add, replace, remove };
}
