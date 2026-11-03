'use client';

import { useId } from 'react';
import { buttonStyles } from '@/component/ui/button.styles';
import { FormAlert } from '@/component/ui/form.alert';
import { TextField } from '@/component/ui/text.field';
import { RoleSelect } from '@/component/workspace/members/role.select';
import { useAddMemberForm } from '@/component/workspace/members/use.add.member.form';
import { SITE_NAME } from '@/lib/site';
import { Member } from '@/model/member.model';

type Props = { workspaceId: string; onAdded: (member: Member) => void };

export function AddMemberForm({ workspaceId, onAdded }: Props) {
  const form = useAddMemberForm(workspaceId, onAdded);
  const roleId = useId();

  return (
    <form onSubmit={form.handleSubmit} noValidate className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="off"
            placeholder="name@example.com"
            hint={`They need a ${SITE_NAME} account first.`}
            error={form.fieldError || undefined}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={roleId} className="text-xs font-medium text-ink-muted">
            Role
          </label>
          <RoleSelect id={roleId} name="role" defaultValue="EDITOR" className="sm:w-32" />
        </div>
      </div>
      <FormAlert message={form.formError} />
      <div>
        <button type="submit" disabled={form.pending} className={buttonStyles('primary')}>
          {form.pending ? 'Adding…' : 'Add member'}
        </button>
      </div>
    </form>
  );
}
