import { Suspense } from 'react';
import { SignedInOnly } from '@/component/auth/signed.in.only';
import { WorkspaceShell } from '@/component/workspace/workspace.shell';

export default function WorkspaceLayout({ children }: LayoutProps<'/workspaces/[workspaceId]'>) {
  return (
    <SignedInOnly>
      <Suspense>
        <WorkspaceShell>{children}</WorkspaceShell>
      </Suspense>
    </SignedInOnly>
  );
}
