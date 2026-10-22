import { TasksView } from '@/component/task/tasks.view';

// Auth lives in localStorage, which the server can't read. Revisit after moving tokens to cookies.
export const instant = false;

export default function TasksPage() {
  return <TasksView />;
}
