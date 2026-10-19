'use client';

import { useId, useRef, useState } from 'react';
import { MENU_TRIGGER } from '@/component/ui/menu.styles';
import { useDismiss } from '@/component/ui/use.dismiss';
import { CreateWorkspaceDialog } from '@/component/workspace/create.workspace.dialog';
import { WorkspacesState } from '@/component/workspace/use.workspaces';
import { WorkspaceMenu } from '@/component/workspace/workspace.menu';

type SwitcherProps = {
  label: string;
  state: WorkspacesState;
  currentId: string;
  isOwner: boolean;
  onRetry: () => void;
};

export function WorkspaceSwitcher({ label, state, currentId, isOwner, onRetry }: SwitcherProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const createDialog = useRef<HTMLDialogElement>(null);
  const menuId = useId();
  useDismiss(open, setOpen, { root, trigger });

  function openCreate() {
    setOpen(false);
    createDialog.current?.showModal();
  }

  return (
    <div ref={root} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
        className={MENU_TRIGGER}
      >
        <span title={label} className="min-w-0 flex-1 truncate text-base font-semibold text-ink">
          {label}
        </span>
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 text-ink-muted">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <WorkspaceMenu
          id={menuId}
          state={state}
          currentId={currentId}
          isOwner={isOwner}
          onPick={() => setOpen(false)}
          onCreate={openCreate}
          onRetry={onRetry}
        />
      )}
      <CreateWorkspaceDialog ref={createDialog} onClose={() => trigger.current?.focus()} />
    </div>
  );
}
