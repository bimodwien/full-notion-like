import type { Metadata } from 'next';
import { SignedInOnly } from '@/component/auth/signed.in.only';
import { OpenWorkspace } from '@/component/workspace/open.workspace';

export const metadata: Metadata = {
  title: 'Workspaces',
};

export default function WorkspacesPage() {
  return (
    <SignedInOnly>
      <OpenWorkspace />
    </SignedInOnly>
  );
}
