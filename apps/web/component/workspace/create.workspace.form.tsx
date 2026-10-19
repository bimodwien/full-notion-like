'use client';

import { buttonStyles } from '@/component/ui/button.styles';
import { FormAlert } from '@/component/ui/form.alert';
import { TextField } from '@/component/ui/text.field';
import {
  useWorkspaceNameForm,
  WORKSPACE_NAME_MAX,
} from '@/component/workspace/use.workspace.name.form';
import { createWorkspace } from '@/helper/workspace.api';
import { Workspace } from '@/model/workspace.model';

type Props = {
  onCreated: (workspace: Workspace) => void;
  onCancel?: () => void;
};

export function CreateWorkspaceForm({ onCreated, onCancel }: Props) {
  const { error, formError, pending, handleSubmit } = useWorkspaceNameForm(async (name) => {
    onCreated(await createWorkspace(name));
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <TextField
        label="Workspace name"
        name="name"
        autoComplete="off"
        maxLength={WORKSPACE_NAME_MAX}
        hint="You can rename it later in Workspace settings."
        error={error}
      />
      <FormAlert message={formError} />
      <div className={`flex flex-wrap gap-2 ${onCancel ? 'justify-end' : ''}`}>
        {onCancel && (
          <button type="button" onClick={onCancel} className={buttonStyles('utility')}>
            Cancel
          </button>
        )}
        <button type="submit" disabled={pending} className={buttonStyles('primary')}>
          {pending ? 'Creating…' : 'Create workspace'}
        </button>
      </div>
    </form>
  );
}
