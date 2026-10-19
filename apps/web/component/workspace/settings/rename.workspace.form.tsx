'use client';

import { toast } from 'sonner';
import { buttonStyles } from '@/component/ui/button.styles';
import { FormAlert } from '@/component/ui/form.alert';
import { TextField } from '@/component/ui/text.field';
import {
  useWorkspaceNameForm,
  WORKSPACE_NAME_MAX,
} from '@/component/workspace/use.workspace.name.form';
import { useWorkspacesContext } from '@/component/workspace/workspaces.context';
import { renameWorkspace } from '@/helper/workspace.api';
import { Workspace } from '@/model/workspace.model';

export function RenameWorkspaceForm({ workspace }: { workspace: Workspace }) {
  const { rename } = useWorkspacesContext();
  const { error, formError, pending, handleSubmit } = useWorkspaceNameForm(async (name) => {
    if (name === workspace.name) return;
    await renameWorkspace(workspace.id, name);
    rename(workspace.id, name);
    toast('Workspace renamed.');
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <TextField
        label="Workspace name"
        name="name"
        autoComplete="off"
        defaultValue={workspace.name}
        maxLength={WORKSPACE_NAME_MAX}
        error={error}
      />
      <FormAlert message={formError} />
      <div>
        <button type="submit" disabled={pending} className={buttonStyles('primary')}>
          {pending ? 'Saving…' : 'Save name'}
        </button>
      </div>
    </form>
  );
}
