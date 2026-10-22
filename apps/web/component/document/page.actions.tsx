'use client';

import { useId, useRef, useState } from 'react';
import { MENU_ROW, MENU_SURFACE } from '@/component/ui/menu.styles';
import { useDismiss } from '@/component/ui/use.dismiss';
import { DeletePageDialog } from '@/component/document/delete.page.button';
import { MovePageDialog } from '@/component/document/move.page.dialog';
import { REVEAL_ON_ROW, ROW_ICON } from '@/component/document/row.styles';
import { WorkspaceDocument } from '@/model/document.model';

type Action = 'move' | 'delete';

// The row is gone after a delete, so focus lands on the sidebar's Pages heading instead.
function focusPagesHeading() {
  document.getElementById('pages-heading')?.focus();
}

function actionsButton(documentId: string) {
  return document.querySelector<HTMLElement>(`[data-page-actions="${documentId}"]`);
}

// After a move the row sits under its new parent; that parent may be closed, hiding the row.
function focusAfterMove(documentId: string, parentId: string | null) {
  const target = actionsButton(documentId) ?? (parentId ? actionsButton(parentId) : null);
  if (target) target.focus();
  else focusPagesHeading();
}

type MenuProps = { id: string; onPick: (action: Action) => void };

function PageActionsMenu({ id, onPick }: MenuProps) {
  return (
    <div id={id} className={`absolute top-full right-0 w-44 ${MENU_SURFACE}`}>
      <button type="button" onClick={() => onPick('move')} className={MENU_ROW}>
        Move to…
      </button>
      <button type="button" onClick={() => onPick('delete')} className={MENU_ROW}>
        Delete
      </button>
    </div>
  );
}

export function PageActions({ doc }: { doc: WorkspaceDocument }) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<Action | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  useDismiss(open, setOpen, { root, trigger });

  function closeDialog() {
    setAction(null);
    trigger.current?.focus();
  }

  return (
    <div ref={root} className="relative">
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`More actions for ${doc.title}`}
        data-page-actions={doc.id}
        title="Move or delete"
        className={`${ROW_ICON} ${REVEAL_ON_ROW} aria-expanded:opacity-100`}
      >
        <span aria-hidden="true">⋯</span>
      </button>
      {open && (
        <PageActionsMenu
          id={menuId}
          onPick={(next) => {
            setOpen(false);
            setAction(next);
          }}
        />
      )}
      {action === 'move' && (
        <MovePageDialog
          document={doc}
          onClose={closeDialog}
          onMoved={(parentId) => focusAfterMove(doc.id, parentId)}
        />
      )}
      {action === 'delete' && (
        <DeletePageDialog document={doc} onClose={closeDialog} onDeleted={focusPagesHeading} />
      )}
    </div>
  );
}
