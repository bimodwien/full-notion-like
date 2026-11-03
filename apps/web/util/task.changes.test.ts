import { describe, expect, it } from 'vitest';
import { Task } from '@/model/task.model';
import { taskChanges } from '@/util/task.changes';

const original: Task = {
  id: 't1',
  workspaceId: 'w1',
  documentId: 'd1',
  createdById: 'u1',
  assigneeId: 'u2',
  reviewerId: null,
  title: 'Write docs',
  description: 'First draft',
  priority: 'MEDIUM',
  status: 'TODO',
  position: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const unchanged = {
  title: 'Write docs',
  priority: 'MEDIUM',
  description: 'First draft',
  documentId: 'd1',
  assigneeId: 'u2',
  reviewerId: '',
};

describe('taskChanges', () => {
  it('sends nothing when the form matches the task', () => {
    expect(taskChanges(original, form(unchanged))).toEqual({});
  });

  it('trims the title and sends it only when it changed', () => {
    expect(taskChanges(original, form({ ...unchanged, title: '  Write docs  ' }))).toEqual({});
    expect(taskChanges(original, form({ ...unchanged, title: ' Ship docs ' }))).toEqual({
      title: 'Ship docs',
    });
  });

  it('sends a new priority', () => {
    expect(taskChanges(original, form({ ...unchanged, priority: 'CRITICAL' }))).toEqual({
      priority: 'CRITICAL',
    });
  });

  it('turns an emptied field into null so the API clears it', () => {
    expect(
      taskChanges(original, form({ ...unchanged, description: '  ', assigneeId: '' })),
    ).toEqual({ description: null, assigneeId: null });
  });

  it('sets a field that was empty', () => {
    expect(taskChanges(original, form({ ...unchanged, reviewerId: 'u3' }))).toEqual({
      reviewerId: 'u3',
    });
  });

  it('leaves a field alone when it is missing from the form (disabled select)', () => {
    const data = form({ ...unchanged, assigneeId: '' });
    data.delete('assigneeId');
    expect(taskChanges(original, data)).toEqual({});
  });
});
