'use client';

import { useRouter } from 'next/navigation';
import { RefObject, useState } from 'react';
import { toast } from 'sonner';
import { DIALOG_PANEL } from '@/component/ui/dialog.styles';
import { CreateWorkspaceForm } from '@/component/workspace/create.workspace.form';
import { useWorkspacesContext } from '@/component/workspace/workspaces.context';
import { Workspace } from '@/model/workspace.model';

type Props = {
  ref: RefObject<HTMLDialogElement | null>;
  // The menu row that opened the dialog is gone by now, so the caller picks where focus lands.
  onClose: () => void;
};

export function CreateWorkspaceDialog({ ref, onClose }: Props) {
  const router = useRouter();
  const { add } = useWorkspacesContext();
  const [opened, setOpened] = useState(0);

  function handleCreated(workspace: Workspace) {
    add(workspace);
    ref.current?.close();
    router.push(`/workspaces/${workspace.id}`);
    toast('Workspace created.');
  }

  function handleClose() {
    // A fresh key empties the form for the next time the dialog opens.
    setOpened((count) => count + 1);
    onClose();
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="new-workspace-heading"
      onClose={handleClose}
      className={DIALOG_PANEL}
    >
      <h2 id="new-workspace-heading" className="mb-4 text-h3">
        New workspace
      </h2>
      <CreateWorkspaceForm
        key={opened}
        onCreated={handleCreated}
        onCancel={() => ref.current?.close()}
      />
    </dialog>
  );
}
