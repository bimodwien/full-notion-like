import { TaskStatus } from '../generated/prisma/enums';

// Status hanya boleh maju satu langkah.
const NEXT_STATUS: Record<TaskStatus, TaskStatus | null> = {
  [TaskStatus.TODO]: TaskStatus.IN_PROGRESS,
  [TaskStatus.IN_PROGRESS]: TaskStatus.IN_REVIEW,
  [TaskStatus.IN_REVIEW]: TaskStatus.DONE,
  [TaskStatus.DONE]: null,
};

export function canTransition(from: TaskStatus, to: TaskStatus) {
  return NEXT_STATUS[from] === to;
}
