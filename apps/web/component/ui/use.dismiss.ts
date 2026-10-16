'use client';

import { RefObject, useEffect, useLayoutEffect } from 'react';

type DismissRefs = {
  root: RefObject<HTMLElement | null>;
  trigger: RefObject<HTMLButtonElement | null>;
};

// Closes a disclosure menu on a click outside it, or on Escape (focus goes back to its button).
export function useDismiss(
  open: boolean,
  setOpen: (open: boolean) => void,
  { root, trigger }: DismissRefs,
) {
  // With cacheComponents, Next hides a route instead of unmounting it, so close the menu on hide.
  useLayoutEffect(() => () => setOpen(false), [setOpen]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setOpen(false);
      trigger.current?.focus();
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, setOpen, root, trigger]);
}
