import { TaskStatus } from '../generated/prisma/enums';

// Status boleh pindah ke mana saja, termasuk mundur (mis. In Review -> In Progress).
export function canTransition(from: TaskStatus, to: TaskStatus) {
  return from !== to;
}
