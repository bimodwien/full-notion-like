'use client';

import { useWorkspaceTasks } from '@/component/task/tasks.context';

// Renders nothing until members load, so the card never flashes a wrong name.
export function TaskAssignee({ assigneeId }: { assigneeId: string | null }) {
  const { members } = useWorkspaceTasks();
  if (assigneeId === null || members.kind !== 'ready') return null;

  const member = members.members.find(({ user }) => user.id === assigneeId);
  return (
    <p className="min-w-0 truncate text-xs text-ink-secondary">
      <span className="sr-only">Assignee: </span>
      {member?.user.name ?? 'Former member'}
    </p>
  );
}
