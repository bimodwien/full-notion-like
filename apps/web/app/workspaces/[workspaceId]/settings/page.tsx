import { WorkspaceSettings } from '@/component/workspace/workspace.settings';

// Auth lives in localStorage, which the server can't read. Revisit after moving tokens to cookies.
export const instant = false;

export default function WorkspaceSettingsPage() {
  return <WorkspaceSettings />;
}
