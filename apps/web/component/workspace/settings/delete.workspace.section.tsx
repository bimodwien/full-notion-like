'use client';

import { RefObject, useRef, useState } from 'react';
import { buttonStyles } from '@/component/ui/button.styles';
import { DIALOG_PANEL } from '@/component/ui/dialog.styles';
import { FormAlert } from '@/component/ui/form.alert';
import { ConfirmNameField } from '@/component/workspace/settings/confirm.name.field';
import { useConfirmDelete } from '@/component/workspace/settings/use.confirm.delete.workspace';
import { Workspace } from '@/model/workspace.model';

const HEADING_ID = 'delete-workspace-dialog-heading';

function ConfirmDeleteForm({
  workspace,
  onCancel,
}: {
  workspace: Workspace;
  onCancel: () => void;
}) {
  const { typed, fieldError, formError, busy, type, submit } = useConfirmDelete(workspace);

  return (
    <form onSubmit={submit} noValidate>
      <h2 id={HEADING_ID} className="text-h3">
        Delete this workspace?
      </h2>
      <p className="mt-2 text-base wrap-break-word text-ink-muted">
        Every page in &ldquo;{workspace.name}&rdquo; will be deleted for all members. This
        can&apos;t be undone.
      </p>
      <ConfirmNameField name={workspace.name} value={typed} error={fieldError} onChange={type} />
      {formError && (
        <div className="mt-3">
          <FormAlert message={formError} />
        </div>
      )}
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button type="button" onClick={onCancel} className={buttonStyles('utility')}>
          Cancel
        </button>
        <button type="submit" disabled={busy} className={buttonStyles('danger')}>
          {busy ? 'Deleting…' : 'Delete workspace'}
        </button>
      </div>
    </form>
  );
}

type DialogProps = { ref: RefObject<HTMLDialogElement | null>; workspace: Workspace };

function DeleteWorkspaceDialog({ ref, workspace }: DialogProps) {
  // A fresh key clears the typed name each time the dialog closes.
  const [opened, setOpened] = useState(0);
  return (
    <dialog
      ref={ref}
      aria-labelledby={HEADING_ID}
      onClose={() => setOpened((count) => count + 1)}
      className={DIALOG_PANEL}
    >
      <ConfirmDeleteForm key={opened} workspace={workspace} onCancel={() => ref.current?.close()} />
    </dialog>
  );
}

export function DeleteWorkspaceSection({ workspace }: { workspace: Workspace }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <section
      aria-labelledby="delete-workspace-heading"
      className="mt-12 border-t border-hairline pt-8"
    >
      <h2 id="delete-workspace-heading" className="text-h3 text-ink">
        Delete workspace
      </h2>
      <p className="mt-2 text-base text-ink-muted">
        Deletes this workspace and every page in it, for all members. This can&apos;t be undone.
      </p>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className={buttonStyles('danger', 'mt-4')}
      >
        Delete workspace
      </button>
      <DeleteWorkspaceDialog ref={dialog} workspace={workspace} />
    </section>
  );
}
