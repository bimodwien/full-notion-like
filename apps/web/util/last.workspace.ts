const LAST_WORKSPACE_KEY = 'lastWorkspaceId';

export function saveLastWorkspace(workspaceId: string) {
  localStorage.setItem(LAST_WORKSPACE_KEY, workspaceId);
}

export function getLastWorkspace() {
  return localStorage.getItem(LAST_WORKSPACE_KEY);
}
