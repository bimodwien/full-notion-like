'use client';

import { PRIORITY_LABEL } from '@/component/task/priority.field';
import { TaskActions } from '@/component/task/task.actions';
import { TaskOpenButton } from '@/component/task/task.open.button';
import { useChangeTaskStatus } from '@/component/task/use.change.task.status';
import { Task, TaskPriority } from '@/model/task.model';
import { TaskAssignee } from '@/component/task/task.assignee';
import { STATUS_LABEL } from '@/util/task.board';
import type { CSSProperties } from 'react';
import type { useSortable } from '@dnd-kit/sortable';

const PRIORITY_BADGE: Record<TaskPriority, string> = {
  LOW: 'bg-[#03571f09] text-[#1f6b40]',
  MEDIUM: 'bg-[#cfaf0010] text-[#7a5800]',
  CRITICAL: 'bg-[#c7030309] text-[#bf3126]',
};

export type CardDrag = Pick<
  ReturnType<typeof useSortable>,
  'setNodeRef' | 'listeners' | 'isDragging'
> & { style: CSSProperties };

const DRAG_CLASS = 'cursor-grab touch-manipulation';

type Props = { task: Task; showStatus?: boolean; drag?: CardDrag };

export function TaskCard({ task, showStatus = false, drag }: Props) {
  const { failed, changeStatus } = useChangeTaskStatus(task);
  return (
    <li
      ref={drag?.setNodeRef}
      style={drag?.style}
      {...drag?.listeners}
      tabIndex={-1}
      data-task-card={task.id}
      className={`group relative flex flex-col gap-2 rounded-sm border border-hairline bg-canvas p-3 hover:border-field ${drag ? DRAG_CLASS : ''} ${drag?.isDragging ? 'opacity-40' : ''}`}
    >
      <div className="flex items-start gap-2">
        <TaskOpenButton task={task} />
        <TaskActions task={task} onChangeStatus={changeStatus} />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="-ml-1.5 flex items-center gap-3 text-xs">
          {showStatus && (
            <p className="pl-1.5 text-ink-secondary">
              <span className="sr-only">Status: </span>
              {STATUS_LABEL[task.status]}
            </p>
          )}
          <p className={`rounded-xs px-1.5 py-0.5 font-medium ${PRIORITY_BADGE[task.priority]}`}>
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
