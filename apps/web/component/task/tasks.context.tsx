'use client';

import { createContext, useContext } from 'react';
import { useTasks } from '@/component/task/use.tasks';

type WorkspaceTasks = ReturnType<typeof useTasks>;

const TasksContext = createContext<WorkspaceTasks | null>(null);

export function TasksProvider({
  workspaceId,
  children,
}: {
  workspaceId: string;
  children: React.ReactNode;
}) {
  const tasks = useTasks(workspaceId);
  return <TasksContext value={tasks}>{children}</TasksContext>;
}

export function useWorkspaceTasks() {
  const value = useContext(TasksContext);
  if (!value) throw new Error('useWorkspaceTasks must be used inside TasksProvider');
  return value;
}
