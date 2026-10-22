'use client';

import { isAxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';
import { buttonStyles } from '@/component/ui/button.styles';
import { Initial } from '@/component/ui/initial';
import { ROLE_LABELS, RoleSelect } from '@/component/workspace/members/role.select';
import { changeMemberRole, removeMember } from '@/helper/member.api';
import { requestErrorMessage } from '@/helper/request.error';
import { Member, MemberRole } from '@/model/member.model';

type Props = {
  workspaceId: string;
  member: Member;
  onRoleChange: (userId: string, role: MemberRole) => void;
  onRemoved: (userId: string) => void;
};

function useMemberActions({ workspaceId, member, onRoleChange, onRemoved }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { id, name } = member.user;

  async function changeRole(role: MemberRole) {
    const previous = member.role as MemberRole;
    setError('');
    setBusy(true);
    onRoleChange(id, role);
    try {
      await changeMemberRole(workspaceId, id, role);
      toast(`${name} is now ${ROLE_LABELS[role].toLowerCase()}.`);
    } catch (caught) {
      onRoleChange(id, previous);
      setError(requestErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setError('');
    setBusy(true);
    try {
      await removeMember(workspaceId, id);
    } catch (caught) {
      // A 404 means someone else already removed them, which is the outcome we wanted.
      if (!isAxiosError(caught) || caught.response?.status !== 404) {
        setError(requestErrorMessage(caught));
        setBusy(false);
        return;
      }
    }
    toast(`${name} removed.`);
    onRemoved(id);
  }

  return { busy, error, changeRole, remove };
}

function MemberControls(props: Props & ReturnType<typeof useMemberActions>) {
  const { member, busy, changeRole, remove } = props;
  if (member.role === 'OWNER') {
    return <p className="text-body-sm text-ink-muted">{ROLE_LABELS.OWNER}</p>;
  }
  return (
    <div className="flex items-center gap-2">
      <RoleSelect
        aria-label={`Role for ${member.user.name}`}
        value={member.role}
        disabled={busy}
        onChange={(event) => changeRole(event.target.value as MemberRole)}
      />
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        aria-label={`Remove ${member.user.name}`}
        className={buttonStyles('utility')}
      >
        Remove
      </button>
    </div>
  );
}

export function MemberRow(props: Props) {
  const actions = useMemberActions(props);
  const { name, email } = props.member.user;
  // Settings is owner-only, so the owner row is always the person reading it.
  const isYou = props.member.role === 'OWNER';

  return (
    <li className="py-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Initial name={name} />
          <div className="min-w-0">
            <p className="text-base font-medium wrap-break-word text-ink">
              {name}
              {isYou && <span className="font-normal text-ink-muted"> (you)</span>}
            </p>
            <p className="text-body-sm break-all text-ink-muted">{email}</p>
          </div>
        </div>
        <div className="pl-11 sm:pl-0">
          <MemberControls {...props} {...actions} />
        </div>
      </div>
      {actions.error && (
        <p role="alert" className="mt-2 text-sm text-error sm:pl-11">
          {actions.error}
        </p>
      )}
    </li>
  );
}
