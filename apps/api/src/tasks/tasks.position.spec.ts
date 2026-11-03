import { hasRoom, positionBetween } from './tasks.position';

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
});

describe('hasRoom', () => {
  it('always has room at either end of a column', () => {
    expect(hasRoom()).toBe(true);
    expect(hasRoom(undefined, 1)).toBe(true);
    expect(hasRoom(1, undefined)).toBe(true);
  });

  it('has room while the gap is wider than the minimum', () => {
    expect(hasRoom(1, 1.001)).toBe(true);
  });

  it('runs out of room once the gap is too small to halve', () => {
    expect(hasRoom(1, 1 + 1e-7)).toBe(false);
  });

  it('runs out of room after repeated halving', () => {
    let below = 2;
    let halvings = 0;
    while (hasRoom(1, below)) {
      below = positionBetween(1, below);
      halvings += 1;
    }
    expect(halvings).toBe(20);
  });
});
