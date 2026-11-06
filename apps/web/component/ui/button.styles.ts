const BASE =
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors disabled:cursor-wait motion-safe:active:scale-98';

// Buttons are 36px with a mouse and 44px on touch screens. Landing is the large pill and stays 44px.
const SIZE = 'min-h-9 pointer-coarse:min-h-11 text-sm';

const VARIANTS = {
  primary: `${SIZE} rounded-md bg-primary px-4 text-on-primary hover:bg-primary-active cursor-pointer`,
  landing:
    'min-h-11 text-base rounded-md bg-primary px-5 text-on-primary hover:bg-primary-active cursor-pointer',
  utility: `${SIZE} rounded-md border border-field bg-surface px-3 text-ink hover:bg-canvas-soft cursor-pointer`,
  danger: `${SIZE} rounded-md bg-error px-4 text-on-primary hover:bg-error/90 cursor-pointer`,
  // Quiet toolbar action: no frame until hovered.
  ghost:
    'min-h-9 pointer-coarse:min-h-11 text-sm rounded-md px-3 text-ink-secondary hover:bg-black/5 hover:text-ink cursor-pointer',
};

export type ButtonVariant = keyof typeof VARIANTS;

export function buttonStyles(variant: ButtonVariant, extra = '') {
  return `${BASE} ${VARIANTS[variant]} ${extra}`.trim();
}
