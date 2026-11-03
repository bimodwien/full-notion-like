import { describe, expect, it } from 'vitest';
import { Task, TaskStatus } from '@/model/task.model';
import { tasksWithStatus } from '@/util/task.board';
import { dropTarget } from '@/util/task.drop';

function task(id: string, status: TaskStatus, position: number): Task {
  return {
    id,
    workspaceId: 'w1',
    documentId: null,
    createdById: 'u1',
    assigneeId: null,
    reviewerId: null,
    title: id,
    description: null,
    priority: 'MEDIUM',
    status,
    position,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

// To Do: a, b, c from top to bottom. In Progress: x.
const a = task('a', 'TODO', 1);
const b = task('b', 'TODO', 2);
const c = task('c', 'TODO', 3);
const x = task('x', 'IN_PROGRESS', 1);
const tasks = [c, x, a, b];

describe('tasksWithStatus', () => {
  it('keeps one column, top card first', () => {
    expect(tasksWithStatus(tasks, 'TODO').map((t) => t.id)).toEqual(['a', 'b', 'c']);
  });
});

describe('dropTarget', () => {
  it('returns null when a card is dropped on itself', () => {
    expect(dropTarget(tasks, b, 'b')).toBeNull();
  });

  it('moves a card down into the spot of the card it lands on', () => {
    expect(dropTarget(tasks, a, 'c')).toEqual({
      status: 'TODO',
      position: 4,
      place: { aboveId: 'c', belowId: undefined },
    });
  });

  it('moves a card up into the spot of the card it lands on', () => {
    expect(dropTarget(tasks, c, 'b')).toEqual({
      status: 'TODO',
      position: 1.5,
      place: { aboveId: 'a', belowId: 'b' },
    });
  });

  it('puts a card above the card it lands on in another column', () => {
    expect(dropTarget(tasks, b, 'x')).toEqual({
      status: 'IN_PROGRESS',
      position: 0,
      place: { aboveId: undefined, belowId: 'x' },
    });
  });

  it('puts a card at the bottom when it lands on the column itself', () => {
    expect(dropTarget(tasks, a, 'IN_PROGRESS')).toEqual({
      status: 'IN_PROGRESS',
      position: 2,
      place: { aboveId: 'x', belowId: undefined },
    });
  });

  it('starts an empty column at 1', () => {
    expect(dropTarget(tasks, a, 'DONE')).toEqual({
      status: 'DONE',
      position: 1,
      place: { aboveId: undefined, belowId: undefined },
    });
  });

  it('returns null when the last card is dropped on its own column', () => {
    expect(dropTarget(tasks, c, 'TODO')).toBeNull();
  });

  it('returns null for an id that is neither a card nor a column', () => {
    expect(dropTarget(tasks, a, 'nowhere')).toBeNull();
  });
});
