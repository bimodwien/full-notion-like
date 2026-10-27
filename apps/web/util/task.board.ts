import { Task, TaskStatus } from '@/model/task.model';

export const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

export const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW: 'In Review',
  DONE: 'Done',
};

export function tasksWithStatus(tasks: Task[], status: TaskStatus) {
  return tasks.filter((task) => task.status === status).sort((a, b) => a.position - b.position);
}
