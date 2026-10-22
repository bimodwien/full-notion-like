// 28px wide keeps nested titles readable in a 240px sidebar; height stays 44px.
export const ROW_ICON =
  'grid h-11 w-7 shrink-0 cursor-pointer place-items-center rounded-sm text-ink-muted hover:text-ink';

// Hidden until the row is hovered or focused; touch screens have no hover, so always shown there.
export const REVEAL_ON_ROW =
  'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-coarse:opacity-100';
