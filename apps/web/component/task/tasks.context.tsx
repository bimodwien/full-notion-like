'use client';

import { createContext, useContext } from 'react';
import { useTasks } from '@/component/task/use.tasks';
import { MembersState, useMembers } from '@/component/workspace/members/use.members';

type WorkspaceTasks = ReturnType<typeof useTasks> & { members: MembersState };

const TasksContext = createContext<WorkspaceTasks | null>(null);

export function TasksProvider({
  workspaceId,
  children,
}: {
  workspaceId: string;
  children: React.ReactNode;
}) {
  const tasks = useTasks(workspaceId);
  const { state: members } = useMembers(workspaceId);
  return <TasksContext value={{ ...tasks, members }}>{children}</TasksContext>;
}

export function useWorkspaceTasks() {
  const value = useContext(TasksContext);
  if (!value) throw new Error('useWorkspaceTasks must be used inside TasksProvider');
  return value;
}
