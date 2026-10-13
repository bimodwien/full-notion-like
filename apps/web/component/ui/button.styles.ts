const BASE =
  'inline-flex min-h-11 items-center justify-center whitespace-nowrap text-base font-medium transition-colors disabled:cursor-wait motion-safe:active:scale-98';

const VARIANTS = {
  primary: 'rounded-md bg-primary px-5 mt-2 text-on-primary hover:bg-primary-active cursor-pointer',
  secondary:
    'rounded-full bg-surface px-5 text-ink shadow-soft hover:bg-canvas-soft cursor-pointer',
  utility:
    'rounded-md border border-field bg-surface px-3.5 text-ink hover:bg-canvas-soft cursor-pointer',
};

export type ButtonVariant = keyof typeof VARIANTS;

export function buttonStyles(variant: ButtonVariant, extra = '') {
  return `${BASE} ${VARIANTS[variant]} ${extra}`.trim();
}
