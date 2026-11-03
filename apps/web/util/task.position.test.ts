import { describe, expect, it } from 'vitest';
import { positionBetween } from '@/util/task.position';

describe('positionBetween', () => {
  it('starts an empty column at 1', () => {
    expect(positionBetween()).toBe(1);
  });

  it('goes one step above the top card', () => {
    expect(positionBetween(undefined, 3)).toBe(2);
  });

  it('goes one step below the bottom card', () => {
    expect(positionBetween(3, undefined)).toBe(4);
  });

  it('takes the midpoint between two cards', () => {
    expect(positionBetween(1, 2)).toBe(1.5);
  });

  it('can go below zero when cards keep landing on top', () => {
    expect(positionBetween(undefined, 0.5)).toBe(-0.5);
  });
});
