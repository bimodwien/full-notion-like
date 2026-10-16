'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SiteNav } from '@/component/home/site.nav';
import { buttonStyles } from '@/component/ui/button.styles';
import { useWorkspaces } from '@/component/workspace/use.workspaces';
import { Workspace } from '@/model/workspace.model';
import { getLastWorkspace } from '@/util/last.workspace';

// Only shown when there is no workspace to open, so the nav's Sign out stays reachable.
function NoWorkspaceFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-360 flex-1 px-4 py-10 sm:px-8 sm:py-16">
        <h1 className="text-h1 text-ink">Workspaces</h1>
        <div className="mt-8">{children}</div>
      </main>
    </>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert">
      <p className="text-base font-semibold text-ink">Couldn&apos;t load your workspaces.</p>
      <p className="mt-1 text-base text-ink-muted">
        Check that you&apos;re online, then try again.
      </p>
      <button type="button" onClick={onRetry} className={buttonStyles('utility', 'mt-4')}>
        Try again
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div>
      <p className="text-base font-semibold text-ink">You aren&apos;t in a workspace yet.</p>
      <p className="mt-1 max-w-xl text-base text-ink-muted">
        This site can&apos;t create one yet. A workspace owner can add you as a member meanwhile.
      </p>
    </div>
  );
}

// The saved id can belong to a workspace this account has since left, or to another account.
function pickWorkspace(workspaces: Workspace[]) {
  const lastId = getLastWorkspace();
  return workspaces.find(({ id }) => id === lastId)?.id ?? workspaces[0]?.id;
}

export function OpenWorkspace() {
  const { state, retry } = useWorkspaces();
  const router = useRouter();
  const targetId = state.kind === 'ready' ? pickWorkspace(state.workspaces) : undefined;

  useEffect(() => {
    // replace, not push: Back must skip this page or it would redirect forward again.
    if (targetId) router.replace(`/workspaces/${targetId}`);
  }, [targetId, router]);

  if (state.kind === 'error') {
    return (
      <NoWorkspaceFrame>
        <ErrorState onRetry={retry} />
      </NoWorkspaceFrame>
    );
  }
  if (state.kind === 'ready' && !targetId) {
    return (
      <NoWorkspaceFrame>
        <EmptyState />
      </NoWorkspaceFrame>
    );
  }
  return (
    <p role="status" className="m-auto px-4 text-body-sm text-ink-muted">
      Opening your workspace…
    </p>
  );
}
