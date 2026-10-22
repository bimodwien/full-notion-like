export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'CRITICAL';

export type Task = {
  id: string;
  workspaceId: string;
  documentId: string | null;
  createdById: string;
  assigneeId: string | null;
  reviewerId: string | null;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};
