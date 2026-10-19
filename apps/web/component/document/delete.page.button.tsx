'use client';

import { useRouter } from 'next/navigation';
import { RefObject, startTransition, useRef, useState } from 'react';
import { buttonStyles } from '@/component/ui/button.styles';
import { DIALOG_PANEL } from '@/component/ui/dialog.styles';
import { useWorkspaceDocuments } from '@/component/document/documents.context';
import { deleteDocument } from '@/helper/document.api';
import { WorkspaceDocument } from '@/model/document.model';

type DialogProps = {
  ref: RefObject<HTMLDialogElement | null>;
  document: WorkspaceDocument;
};

function DeletePageDialog({ ref, document }: DialogProps) {
  const router = useRouter();
  const { workspaceId, remove } = useWorkspaceDocuments();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function confirmDelete() {
    setBusy(true);
    setFailed(false);
    try {
      await deleteDocument(workspaceId, document.id);
      // Same transition, so this page never renders its "doesn't exist" state on the way out.
      startTransition(() => {
        router.replace(`/workspaces/${workspaceId}`);
        remove(document.id);
      });
    } catch {
      setFailed(true);
      setBusy(false);
    }
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="delete-page-heading"
      onClose={() => setFailed(false)}
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
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className={buttonStyles('utility')}
      >
        Delete page
      </button>
      <DeletePageDialog ref={dialog} document={document} />
    </>
  );
}
