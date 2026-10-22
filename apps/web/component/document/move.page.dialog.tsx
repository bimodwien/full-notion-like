'use client';

import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { toast } from 'sonner';
import { buttonStyles } from '@/component/ui/button.styles';
import { DIALOG_PANEL } from '@/component/ui/dialog.styles';
import { MENU_ROW } from '@/component/ui/menu.styles';
import { useShowModal } from '@/component/ui/use.show.modal';
import { useWorkspaceDocuments } from '@/component/document/documents.context';
import { updateDocument } from '@/helper/document.api';
import { WorkspaceDocument } from '@/model/document.model';
import { moveTargets } from '@/util/document.tree';

const INDENT_PX = 12;

type TargetProps = {
  label: string;
  depth: number;
  current: boolean;
  busy: boolean;
  onPick: () => void;
};

function TargetButton({ label, depth, current, busy, onPick }: TargetProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onPick}
        disabled={current || busy}
        title={label}
        style={{ paddingLeft: 8 + depth * INDENT_PX }}
        className={`${MENU_ROW} disabled:cursor-default disabled:hover:bg-transparent`}
      >
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {current && <span className="shrink-0 text-xs text-ink-muted">Current</span>}
      </button>
    </li>
  );
}

function useMovePage(document: WorkspaceDocument, onMoved: (parentId: string | null) => void) {
  const { workspaceId, move } = useWorkspaceDocuments();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function moveTo(parentId: string | null, label: string, dialog: HTMLDialogElement | null) {
    setBusy(true);
    setFailed(false);
    try {
      await updateDocument(workspaceId, document.id, { parentId });
      toast(parentId ? `Moved into ${label}.` : 'Moved to the top level.');
      dialog?.close();
      // The row re-renders under its new parent, so commit now and let the caller place focus.
      flushSync(() => move(document.id, parentId));
      onMoved(parentId);
    } catch {
      setFailed(true);
      setBusy(false);
    }
  }

  return { busy, failed, moveTo };
}

type Props = {
  document: WorkspaceDocument;
  onClose: () => void;
  onMoved: (parentId: string | null) => void;
};

// Mounted only while open, like the delete dialog.
export function MovePageDialog({ document, onClose, onMoved }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const { state } = useWorkspaceDocuments();
  const { busy, failed, moveTo } = useMovePage(document, onMoved);
  const targets = state.kind === 'ready' ? moveTargets(state.documents, document.id) : [];
  useShowModal(ref);

  return (
    <dialog
      ref={ref}
      aria-labelledby="move-page-heading"
      onClose={onClose}
      className={DIALOG_PANEL}
    >
      <h2 id="move-page-heading" className="text-h3 wrap-break-word">
        Move &ldquo;{document.title}&rdquo;
      </h2>
      <p className="mt-2 text-base text-ink-muted">
        Pick where it goes. Pages inside it move along with it.
      </p>
      <ul
        aria-label="Destinations"
        className="mt-4 max-h-72 overflow-y-auto rounded-md border border-hairline p-1"
      >
        <TargetButton
          label="Top level"
          depth={0}
          current={document.parentId === null}
          busy={busy}
          onPick={() => moveTo(null, 'Top level', ref.current)}
        />
        {targets.map(({ doc, depth }) => (
          <TargetButton
            key={doc.id}
            label={doc.title}
            depth={depth + 1}
            current={doc.id === document.parentId}
            busy={busy}
            onPick={() => moveTo(doc.id, doc.title, ref.current)}
          />
        ))}
      </ul>
      {failed && (
        <p role="alert" className="mt-3 text-body-sm text-error">
          Couldn&apos;t move the page. Try again.
        </p>
      )}
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          className={buttonStyles('utility')}
        >
          Cancel
        </button>
      </div>
    </dialog>
  );
}
