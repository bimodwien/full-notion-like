'use client';

import { useParams } from 'next/navigation';
import { buttonStyles } from '@/component/ui/button.styles';
import { MembersSection } from '@/component/workspace/members/members.section';
import { DeleteWorkspaceSection } from '@/component/workspace/settings/delete.workspace.section';
import { RenameWorkspaceForm } from '@/component/workspace/settings/rename.workspace.form';
import { findWorkspace } from '@/component/workspace/use.workspaces';
import { useWorkspacesContext } from '@/component/workspace/workspaces.context';

function Notice({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h1 className="text-h3 text-ink">{title}</h1>
      <p className="mt-1 text-base text-ink-muted">{text}</p>
    </div>
  );
}

function SettingsBody({ workspaceId }: { workspaceId: string }) {
  const { state, retry } = useWorkspacesContext();

  if (state.kind === 'loading') {
    return (
      <p role="status" className="text-base text-ink-muted">
        Loading settings…
      </p>
    );
  }
  if (state.kind === 'error') {
    return (
      <div role="alert">
        <p className="text-base font-semibold text-ink">Couldn&apos;t load this workspace.</p>
        <button type="button" onClick={retry} className={buttonStyles('utility', 'mt-4')}>
          Try again
        </button>
      </div>
    );
  }

  const workspace = findWorkspace(state, workspaceId);
  if (!workspace) {
    return (
      <Notice
        title="This workspace doesn't exist."
        text="It may have been deleted. Pick another one from the menu at the top of the sidebar."
      />
    );
  }
  if (workspace.members[0]?.role !== 'OWNER') {
    return (
      <Notice
        title="Only the owner can change these settings."
        text="Ask the workspace owner if the name or the member list needs to change."
      />
    );
  }
  return (
    <>
      <h1 className="mb-8 text-h2 text-ink">Workspace settings</h1>
      <RenameWorkspaceForm key={workspace.id} workspace={workspace} />
      <MembersSection key={`members-${workspace.id}`} workspaceId={workspace.id} />
      <DeleteWorkspaceSection workspace={workspace} />
    </>
  );
}

export function WorkspaceSettings() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  return (
    <div className="mx-auto w-full max-w-180">
      <SettingsBody workspaceId={workspaceId} />
    </div>
  );
}
