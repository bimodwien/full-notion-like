'use client';

import Link from 'next/link';
import { buttonStyles } from '@/component/ui/button.styles';
import { MENU_PANEL, MENU_ROW } from '@/component/ui/menu.styles';
import { WorkspacesState } from '@/component/workspace/use.workspaces';
import { Workspace, WorkspaceRole } from '@/model/workspace.model';

const ROLE_LABEL: Record<WorkspaceRole, string> = {
  OWNER: 'Owner',
  EDITOR: 'Editor',
  VIEWER: 'Viewer',
};

function CheckMark({ visible }: { visible: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={`size-4 shrink-0 text-ink ${visible ? '' : 'invisible'}`}
    >
      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

type RowProps = { workspace: Workspace; active: boolean; onPick: () => void };

function WorkspaceRow({ workspace, active, onPick }: RowProps) {
  const role = workspace.members[0]?.role;
  return (
    <li>
      <Link
        href={`/workspaces/${workspace.id}`}
        aria-current={active ? 'page' : undefined}
        onClick={onPick}
        className={MENU_ROW}
      >
        <span className="min-w-0 flex-1 truncate">{workspace.name}</span>
        {role && <span className="shrink-0 text-xs text-ink-muted">{ROLE_LABEL[role]}</span>}
        <CheckMark visible={active} />
      </Link>
    </li>
  );
}

type MenuProps = {
  id: string;
  state: WorkspacesState;
  currentId: string;
  onPick: () => void;
  onRetry: () => void;
};

function WorkspaceRows({ state, currentId, onPick, onRetry }: Omit<MenuProps, 'id'>) {
  if (state.kind === 'loading') {
    return (
      <p role="status" className="px-2 py-2 text-body-sm text-ink-muted">
        Loading workspaces…
      </p>
    );
  }
  if (state.kind === 'error') {
    return (
      <div role="alert" className="px-2 py-2">
        <p className="text-body-sm text-ink">Couldn&apos;t load workspaces.</p>
        <button type="button" onClick={onRetry} className={buttonStyles('utility', 'mt-2')}>
          Try again
        </button>
      </div>
    );
  }
  return (
    <ul>
      {state.workspaces.map((workspace) => (
        <WorkspaceRow
          key={workspace.id}
          workspace={workspace}
          active={workspace.id === currentId}
          onPick={onPick}
        />
      ))}
    </ul>
  );
}

export function WorkspaceMenu({ id, ...rows }: MenuProps) {
  return (
    <div id={id} className={`${MENU_PANEL} top-full mt-1`}>
      <p className="px-2 pt-1 pb-1 text-xs font-medium text-ink-muted">Workspaces</p>
      <WorkspaceRows {...rows} />
    </div>
  );
}
