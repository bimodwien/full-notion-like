'use client';

import { PRIORITY_LABEL } from '@/component/task/priority.field';
import { TaskActions } from '@/component/task/task.actions';
import { TaskOpenButton } from '@/component/task/task.open.button';
import { useAdvanceTask } from '@/component/task/use.advance.task';
import { Task, TaskPriority } from '@/model/task.model';
import { TaskAssignee } from '@/component/task/task.assignee';
import { STATUS_LABEL } from '@/util/task.board';

const PRIORITY_TEXT: Record<TaskPriority, string> = {
  LOW: 'text-ink-muted',
  MEDIUM: 'text-ink-secondary',
  CRITICAL: 'font-medium text-error',
};

type Props = { task: Task; showStatus?: boolean };

export function TaskCard({ task, showStatus = false }: Props) {
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
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs">
          {showStatus && (
            <p className="text-ink-secondary">
              <span className="sr-only">Status: </span>
              {STATUS_LABEL[task.status]}
            </p>
          )}
          <p className={PRIORITY_TEXT[task.priority]}>
            <span className="sr-only">Priority: </span>
            {PRIORITY_LABEL[task.priority]}
          </p>
        </div>
        <TaskAssignee assigneeId={task.assigneeId} />
      </div>
      {failed && (
        <p role="alert" className="text-xs text-error">
          Couldn&apos;t move this task. Try again.
        </p>
      )}
    </li>
  );
}
