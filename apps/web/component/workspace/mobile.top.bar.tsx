'use client';

import { useParams } from 'next/navigation';
import { RefObject } from 'react';
import { useWorkspaceDocuments } from '@/component/workspace/documents.context';

export const SIDEBAR_ID = 'workspace-sidebar';

function useCurrentTitle(fallback: string) {
  const { documentId } = useParams<{ documentId?: string }>();
  const { state } = useWorkspaceDocuments();
  if (state.kind !== 'ready' || !documentId) return fallback;
  return state.documents.find((doc) => doc.id === documentId)?.title ?? fallback;
}

type Props = {
  workspaceLabel: string;
  open: boolean;
  onOpen: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
};

// Phones only: the sidebar lives in a drawer, and this bar is the way back to it.
export function MobileTopBar({ workspaceLabel, open, onOpen, buttonRef }: Props) {
  const title = useCurrentTitle(workspaceLabel);
  return (
    <header
      inert={open}
      className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-hairline bg-canvas px-2 md:hidden"
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={onOpen}
        aria-expanded={open}
        aria-controls={SIDEBAR_ID}
        aria-label="Menu"
        className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-sm text-ink hover:bg-black/5"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4">
          <path d="M2 4h12M2 8h12M2 12h12" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <p title={title} className="min-w-0 truncate text-body-sm text-ink-secondary">
        {title}
      </p>
    </header>
  );
}
