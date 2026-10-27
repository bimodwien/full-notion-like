import { TaskPlace } from '@/helper/task.api';
import { Task, TaskStatus } from '@/model/task.model';
import { STATUSES, tasksWithStatus } from '@/util/task.board';
import { positionBetween } from '@/util/task.position';

export type Drop = { status: TaskStatus; position: number; place: TaskPlace };

// overId is a card, or a column's status when the card is dropped on the column itself.
// Returns null when the card would end up where it already is.
export function dropTarget(tasks: Task[], task: Task, overId: string): Drop | null {
  const overTask = tasks.find((item) => item.id === overId);
  if (!overTask && !STATUSES.includes(overId as TaskStatus)) return null;
  const status = overTask?.status ?? (overId as TaskStatus);
  const column = tasksWithStatus(tasks, status);
  const others = column.filter((item) => item.id !== task.id);
  // Like arrayMove: the card takes the spot of the card it was dropped on.
  const index = overTask ? column.indexOf(overTask) : others.length;
  if (status === task.status && index === column.indexOf(task)) return null;
  const above = others[index - 1];
  const below = others[index];
  return {
    status,
    position: positionBetween(above?.position, below?.position),
    place: { aboveId: above?.id, belowId: below?.id },
  };
}
