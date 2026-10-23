import { useId } from 'react';
import { FIELD_LABEL, SELECT } from '@/component/ui/select.styles';
import { TaskPriority } from '@/model/task.model';

export const PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'CRITICAL'];

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  CRITICAL: 'Critical',
};

export function PriorityField({ defaultValue = 'MEDIUM' }: { defaultValue?: TaskPriority }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={FIELD_LABEL}>
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
