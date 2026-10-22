'use client';

import { useParams, useRouter } from 'next/navigation';
import { startTransition, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { buttonStyles } from '@/component/ui/button.styles';
import { DIALOG_PANEL } from '@/component/ui/dialog.styles';
import { useShowModal } from '@/component/ui/use.show.modal';
import { useWorkspaceDocuments } from '@/component/document/documents.context';
import { deleteDocument } from '@/helper/document.api';
import { WorkspaceDocument } from '@/model/document.model';
import { subtreeIds } from '@/util/document.tree';

type DialogProps = {
  document: WorkspaceDocument;
  onClose: () => void;
  // Called when the page is gone and the button that opened the dialog went with it.
  onDeleted?: () => void;
};

function useDeletePage({ document, onDeleted }: DialogProps) {
  const router = useRouter();
  const { documentId: openId } = useParams<{ documentId?: string }>();
  const { workspaceId, state, remove } = useWorkspaceDocuments();

  return async function deletePage(dialog: HTMLDialogElement | null) {
    await deleteDocument(workspaceId, document.id);
    const documents = state.kind === 'ready' ? state.documents : [];
    if (openId && subtreeIds(documents, document.id).has(openId)) {
      // Same transition, so the open page never renders "doesn't exist" on the way out.
      startTransition(() => {
        router.replace(`/workspaces/${workspaceId}`);
        remove(document.id);
      });
      return;
    }
    dialog?.close();
    // Unmount the row before the dialog's close event can send focus back to it.
    flushSync(() => remove(document.id));
    onDeleted?.();
  };
}

// Mounted only while open, so a sidebar full of pages doesn't carry a dialog per row.
export function DeletePageDialog(props: DialogProps) {
  const { document, onClose } = props;
  const ref = useRef<HTMLDialogElement>(null);
  const deletePage = useDeletePage(props);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  useShowModal(ref);

  async function confirmDelete() {
    setBusy(true);
    setFailed(false);
    try {
      await deletePage(ref.current);
    } catch {
      setFailed(true);
      setBusy(false);
    }
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="delete-page-heading"
      onClose={onClose}
      className={DIALOG_PANEL}
    >
      <h2 id="delete-page-heading" className="text-h3">
        Delete this page?
      </h2>
      <p className="mt-2 text-base wrap-break-word text-ink-muted">
        &ldquo;{document.title}&rdquo; and any pages inside it will be deleted. This can&apos;t be
        undone.
      </p>
      {failed && (
        <p role="alert" className="mt-3 text-body-sm text-error">
          Couldn&apos;t delete the page. Try again.
        </p>
      )}
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          className={buttonStyles('utility')}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={confirmDelete}
          disabled={busy}
          className={buttonStyles('danger')}
        >
          {busy ? 'Deleting…' : 'Delete page'}
        </button>
      </div>
    </dialog>
  );
}

export function DeletePageButton({ document }: { document: WorkspaceDocument }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        className={buttonStyles('utility')}
      >
        Delete page
      </button>
      {open && (
        <DeletePageDialog
          document={document}
          onClose={() => {
            setOpen(false);
            trigger.current?.focus();
          }}
        />
      )}
    </>
  );
}
