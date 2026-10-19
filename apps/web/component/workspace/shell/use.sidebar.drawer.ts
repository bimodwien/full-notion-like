'use client';

import { usePathname } from 'next/navigation';
import { RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

// Tailwind's md breakpoint: from here up the sidebar is always on screen.
const DESKTOP = '(min-width: 48rem)';

function useDrawerListeners(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    // On window, so it runs after a menu inside the drawer has handled the same Escape.
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      if (document.querySelector('dialog[open]')) return;
      close();
    }
    const desktop = window.matchMedia(DESKTOP);
    const onWiden = () => desktop.matches && close();
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onWiden);
    return () => {
      root.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onWiden);
    };
  }, [open, close]);
}

function useFocusHandoff(
  open: boolean,
  menuButton: RefObject<HTMLButtonElement | null>,
  closeButton: RefObject<HTMLButtonElement | null>,
) {
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) closeButton.current?.focus();
    else if (wasOpen.current) menuButton.current?.focus();
    wasOpen.current = open;
  }, [open, menuButton, closeButton]);
}

export function useSidebarDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [shownFor, setShownFor] = useState(pathname);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  // Picking a page navigates; close so the page underneath is what the reader sees.
  if (shownFor !== pathname) {
    setShownFor(pathname);
    setOpen(false);
  }

  const close = useCallback(() => setOpen(false), []);
  // With cacheComponents, Next hides a route instead of unmounting it, so close on hide.
  useLayoutEffect(() => close, [close]);
  useDrawerListeners(open, close);
  useFocusHandoff(open, menuButton, closeButton);

  return { open, show: () => setOpen(true), close, menuButton, closeButton };
}
