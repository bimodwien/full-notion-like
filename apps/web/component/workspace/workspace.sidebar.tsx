'use client';

import { RefObject } from 'react';
import { DocumentList } from '@/component/workspace/document.list';
import { SIDEBAR_ID } from '@/component/workspace/mobile.top.bar';
import { ProfileButton } from '@/component/workspace/profile.button';

// Phones: an off-canvas drawer, hidden (and out of the tab order) until opened.
// From md up: the fixed-width column it has always been.
const ASIDE =
  'fixed inset-y-0 left-0 z-30 flex w-[min(18rem,calc(100vw-3rem))] flex-col gap-1 border-r border-hairline bg-canvas-soft p-3 shadow-soft duration-200 motion-reduce:transition-none ' +
  'md:visible md:sticky md:top-0 md:bottom-auto md:z-auto md:h-dvh md:w-60 md:shrink-0 md:translate-x-0 md:shadow-none md:transition-none';

// Opening shows it at once so focus can land inside; closing keeps it visible until the slide ends.
const OPEN = 'visible translate-x-0 transition-[translate]';
const CLOSED = 'invisible -translate-x-full transition-[translate,visibility]';

function CloseButton({
  buttonRef,
  onClose,
}: {
  buttonRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClose}
      aria-label="Close menu"
      className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-sm text-ink-muted hover:bg-black/5 hover:text-ink md:hidden"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4">
        <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  );
}

type Props = {
  switcher: React.ReactNode;
  open: boolean;
  onClose: () => void;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
};

export function WorkspaceSidebar({ switcher, open, onClose, closeButtonRef }: Props) {
  return (
    <>
      {open && (
        // Tap-outside to close; Escape and the close button cover keyboard users.
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
        />
      )}
      <aside id={SIDEBAR_ID} aria-label="Workspace" className={`${ASIDE} ${open ? OPEN : CLOSED}`}>
        <div className="flex items-start gap-1">
          <div className="min-w-0 flex-1">{switcher}</div>
          <CloseButton buttonRef={closeButtonRef} onClose={onClose} />
        </div>
        <DocumentList />
        <ProfileButton />
      </aside>
    </>
  );
}
