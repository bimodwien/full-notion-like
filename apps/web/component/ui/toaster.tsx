import { Toaster } from 'sonner';

// Unstyled so the look comes from our tokens. The row stays full width and
// transparent; only the content box is painted, so it hugs its text.
const CLASS_NAMES = {
  toast: 'flex w-full justify-center',
  content:
    'rounded-md bg-ink-secondary px-4 py-2.5 font-sans text-sm font-medium text-on-primary shadow-soft',
};

export function AppToaster() {
  // One at a time: sonner's stacked pile assumes equal-width toasts, and these differ.
  return (
    <Toaster
      position="bottom-center"
      visibleToasts={1}
      toastOptions={{ unstyled: true, classNames: CLASS_NAMES }}
    />
  );
}
