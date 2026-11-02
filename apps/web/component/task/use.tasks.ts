'use client';

import { useCallback } from 'react';
import { LoadedList, useLoadedList } from '@/component/ui/use.loaded.list';
import { getTasks } from '@/helper/task.api';
import { Task } from '@/model/task.model';

export type TasksState = LoadedList<Task>;

export function useTasks(workspaceId: string, documentId?: string) {
  const load = useCallback(() => getTasks(workspaceId, documentId), [workspaceId, documentId]);
  const { state, retry, updateList } = useLoadedList(load);

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
