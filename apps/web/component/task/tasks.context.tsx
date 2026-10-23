'use client';

import { createContext, useContext } from 'react';
import { useTasks } from '@/component/task/use.tasks';
import { MembersState, useMembers } from '@/component/workspace/members/use.members';

type WorkspaceTasks = ReturnType<typeof useTasks> & {
  members: MembersState;
  documentId?: string;
};

const TasksContext = createContext<WorkspaceTasks | null>(null);

export function TasksProvider({
  workspaceId,
  documentId,
  children,
}: {
  workspaceId: string;
  documentId?: string;
  children: React.ReactNode;
}) {
  const tasks = useTasks(workspaceId, documentId);
  const { state: members } = useMembers(workspaceId);
  return <TasksContext value={{ ...tasks, members, documentId }}>{children}</TasksContext>;
}

export function useWorkspaceTasks() {
  const value = useContext(TasksContext);
  if (!value) throw new Error('useWorkspaceTasks must be used inside TasksProvider');
  return value;
}
