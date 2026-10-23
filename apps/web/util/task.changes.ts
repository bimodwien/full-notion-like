import { TaskChanges } from '@/helper/task.api';
import { Task, TaskPriority } from '@/model/task.model';

const CLEARABLE = ['description', 'documentId', 'assigneeId', 'reviewerId'] as const;

// Only the fields that differ from the task. A disabled select isn't in the form data,
// so a list that failed to load leaves its field untouched.
export function taskChanges(task: Task, data: FormData) {
  const changes: TaskChanges = {};
  const title = String(data.get('title') ?? '').trim();
  if (title !== task.title) changes.title = title;

  const priority = data.get('priority') as TaskPriority | null;
  if (priority && priority !== task.priority) changes.priority = priority;

  for (const key of CLEARABLE) {
    const raw = data.get(key);
    if (raw === null) continue;
    const value = String(raw).trim() || null;
    if (value !== task[key]) changes[key] = value;
  }
  return changes;
}
