import { SelectHTMLAttributes } from 'react';
import { WorkspaceRole } from '@/model/workspace.model';

export const ROLE_LABELS: Record<WorkspaceRole, string> = {
  OWNER: 'Owner',
  EDITOR: 'Editor',
  VIEWER: 'Viewer',
};

const SELECT =
  'min-h-11 cursor-pointer rounded-xs border border-field bg-surface px-2 text-base text-ink disabled:cursor-wait';

// Only the roles the API lets an owner hand out.
export function RoleSelect({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${SELECT} ${className}`.trim()}>
      <option value="EDITOR">{ROLE_LABELS.EDITOR}</option>
      <option value="VIEWER">{ROLE_LABELS.VIEWER}</option>
    </select>
  );
}
