import { api } from '@/lib/axios';
import { Task, TaskPriority, TaskStatus } from '@/model/task.model';

// Mirrors CreateTaskDto in the API: only the title is required.
export type NewTask = {
  title: string;
  description?: string;
  priority?: TaskPriority;
  documentId?: string;
  assigneeId?: string;
  reviewerId?: string;
};

// Mirrors UpdateTaskDto: a missing field stays as it is, null clears it.
export type TaskChanges = {
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  documentId?: string | null;
  assigneeId?: string | null;
  reviewerId?: string | null;
};

export async function getTasks(workspaceId: string, documentId?: string) {
  const { data } = await api.get<Task[]>(`/workspaces/${workspaceId}/tasks`, {
    params: { documentId },
  });
  return data;
}

export async function createTask(workspaceId: string, task: NewTask) {
  const { data } = await api.post<Task>(`/workspaces/${workspaceId}/tasks`, task);
  return data;
}

export async function updateTask(workspaceId: string, taskId: string, changes: TaskChanges) {
  const { data } = await api.patch<Task>(`/workspaces/${workspaceId}/tasks/${taskId}`, changes);
  return data;
}

export async function changeTaskStatus(workspaceId: string, taskId: string, status: TaskStatus) {
  const { data } = await api.patch<Task>(`/workspaces/${workspaceId}/tasks/${taskId}/status`, {
    status,
  });
  return data;
}

export async function deleteTask(workspaceId: string, taskId: string) {
  await api.delete(`/workspaces/${workspaceId}/tasks/${taskId}`);
}
