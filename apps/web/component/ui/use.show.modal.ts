'use client';

import { RefObject, useEffect } from 'react';

// For a <dialog> that is mounted only while it should be open.
export function useShowModal(ref: RefObject<HTMLDialogElement | null>) {
  useEffect(() => {
    const dialog = ref.current;
    // StrictMode runs effects twice in dev; opening an open dialog again throws in some browsers.
    if (dialog && !dialog.open) dialog.showModal();
  }, [ref]);
}
