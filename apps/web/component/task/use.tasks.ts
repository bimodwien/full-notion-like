'use client';

import { useEffect, useState } from 'react';
import { getTasks } from '@/helper/task.api';
import { Task } from '@/model/task.model';

export type TasksState = { kind: 'loading' } | { kind: 'error' } | { kind: 'ready'; tasks: Task[] };

export function useTasks(workspaceId: string) {
  const [state, setState] = useState<TasksState>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getTasks(workspaceId)
      .then((tasks) => {
        if (active) setState({ kind: 'ready', tasks });
      })
      .catch(() => {
        if (active) setState({ kind: 'error' });
      });
    return () => {
      active = false;
    };
  }, [workspaceId, attempt]);

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

  function replace(updated: Task) {
    updateList((tasks) => tasks.map((task) => (task.id === updated.id ? updated : task)));
  }

  function remove(taskId: string) {
    updateList((tasks) => tasks.filter((task) => task.id !== taskId));
  }

  return { state, retry, add, replace, remove };
}
