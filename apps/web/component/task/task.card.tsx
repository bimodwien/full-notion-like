'use client';

import { PRIORITY_LABEL } from '@/component/task/priority.field';
import { TaskActions } from '@/component/task/task.actions';
import { TaskOpenButton } from '@/component/task/task.open.button';
import { useAdvanceTask } from '@/component/task/use.advance.task';
import { Task, TaskPriority } from '@/model/task.model';

const PRIORITY_TEXT: Record<TaskPriority, string> = {
  LOW: 'text-ink-muted',
  MEDIUM: 'text-ink-secondary',
  CRITICAL: 'font-medium text-error',
};

export function TaskCard({ task }: { task: Task }) {
  const { failed, advance } = useAdvanceTask(task);
  return (
    <li
      tabIndex={-1}
      data-task-card={task.id}
      className="group relative flex flex-col gap-2 rounded-sm border border-hairline bg-canvas p-3 hover:border-field"
    >
      <div className="flex items-start gap-2">
        <TaskOpenButton task={task} />
        <TaskActions task={task} onAdvance={advance} />
      </div>
      <p className={`text-xs ${PRIORITY_TEXT[task.priority]}`}>
        <span className="sr-only">Priority: </span>
        {PRIORITY_LABEL[task.priority]}
      </p>
      {failed && (
        <p role="alert" className="text-xs text-error">
          Couldn&apos;t move this task. Try again.
        </p>
      )}
    </li>
  );
}
