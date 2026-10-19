'use client';

import { useRouter } from 'next/navigation';
import { RefObject, startTransition, useId, useRef, useState } from 'react';
import { toast } from 'sonner';
import { buttonStyles } from '@/component/ui/button.styles';
import { DIALOG_PANEL } from '@/component/ui/dialog.styles';
import { FormAlert } from '@/component/ui/form.alert';
import { INPUT } from '@/component/ui/text.field';
import { useWorkspacesContext } from '@/component/workspace/workspaces.context';
import { requestErrorMessage } from '@/helper/request.error';
import { deleteWorkspace } from '@/helper/workspace.api';
import { Workspace } from '@/model/workspace.model';

const HEADING_ID = 'delete-workspace-dialog-heading';

function useDeleteWorkspace(workspace: Workspace) {
  const router = useRouter();
  const { state, remove } = useWorkspacesContext();

  return async function deleteAndLeave() {
    await deleteWorkspace(workspace.id);
    const next =
      state.kind === 'ready' ? state.workspaces.find(({ id }) => id !== workspace.id) : undefined;
    toast('Workspace deleted.');
    // Same transition, so this page never renders "doesn't exist" on the way out.
    startTransition(() => {
      router.replace(next ? `/workspaces/${next.id}` : '/workspaces');
      remove(workspace.id);
    });
  };
}

function ConfirmDeleteForm({
  workspace,
  onCancel,
}: {
  workspace: Workspace;
  onCancel: () => void;
}) {
  const deleteAndLeave = useDeleteWorkspace(workspace);
  const [typed, setTyped] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const inputId = useId();

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    if (typed.trim() !== workspace.name.trim()) {
      setFieldError('Type the workspace name exactly as shown.');
      return;
    }
    setFieldError('');
    setBusy(true);
    try {
      await deleteAndLeave();
    } catch (caught) {
      setFormError(requestErrorMessage(caught));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 id={HEADING_ID} className="text-h3">
        Delete this workspace?
      </h2>
      <p className="mt-2 text-base wrap-break-word text-ink-muted">
        Every page in &ldquo;{workspace.name}&rdquo; will be deleted for all members. This
        can&apos;t be undone.
      </p>
      <label htmlFor={inputId} className="mt-4 block text-xs font-medium text-ink-muted">
        Type <span className="font-semibold wrap-break-word text-ink">{workspace.name}</span> to
        confirm
      </label>
      <input
        id={inputId}
        value={typed}
        onChange={(event) => {
          setTyped(event.target.value);
          setFieldError('');
        }}
        autoComplete="off"
        aria-invalid={fieldError ? true : undefined}
        aria-describedby={fieldError ? `${inputId}-error` : undefined}
        className={`${INPUT} mt-1`}
      />
      {fieldError && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-error">
          {fieldError}
        </p>
      )}
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
