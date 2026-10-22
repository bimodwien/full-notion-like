import { useId } from 'react';
import { TaskPriority } from '@/model/task.model';

export const PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'CRITICAL'];

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  CRITICAL: 'Critical',
};

const SELECT =
  'min-h-11 w-full cursor-pointer rounded-xs border border-field bg-surface px-2 text-base text-ink';

export function PriorityField({ defaultValue = 'MEDIUM' }: { defaultValue?: TaskPriority }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-ink-muted">
        Priority
      </label>
      <select id={id} name="priority" defaultValue={defaultValue} className={SELECT}>
        {PRIORITIES.map((priority) => (
          <option key={priority} value={priority}>
            {PRIORITY_LABEL[priority]}
          </option>
        ))}
      </select>
    </div>
  );
}
