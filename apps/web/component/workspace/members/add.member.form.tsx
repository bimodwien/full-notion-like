'use client';

import { isAxiosError } from 'axios';
import { useId, useState } from 'react';
import { toast } from 'sonner';
import { buttonStyles } from '@/component/ui/button.styles';
import { FormAlert } from '@/component/ui/form.alert';
import { TextField } from '@/component/ui/text.field';
import { RoleSelect } from '@/component/workspace/members/role.select';
import { addMember } from '@/helper/member.api';
import { requestErrorMessage } from '@/helper/request.error';
import { SITE_NAME } from '@/lib/site';
import { Member, MemberRole } from '@/model/member.model';
import { EMAIL_SHAPE } from '@/util/auth.validation';

function emailError(email: string) {
  if (!email) return 'Enter their email address.';
  if (!EMAIL_SHAPE.test(email)) return 'Check the email address. It needs an @ and a domain.';
  return '';
}

// 404 and 409 are about the email itself, so they belong under the field, not in the form alert.
function addErrorMessages(error: unknown) {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  if (status === 404) return { field: `No ${SITE_NAME} account uses this email yet.`, form: '' };
  if (status === 409) return { field: 'This person is already in the workspace.', form: '' };
  return { field: '', form: requestErrorMessage(error) };
}

type Props = { workspaceId: string; onAdded: (member: Member) => void };

export function AddMemberForm({ workspaceId, onAdded }: Props) {
  const [fieldError, setFieldError] = useState('');
  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);
  const roleId = useId();

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get('email') ?? '').trim();
    const role = String(data.get('role')) as MemberRole;
    const emailField = form.elements.namedItem('email') as HTMLInputElement;

    const invalid = emailError(email);
    setFormError('');
    setFieldError(invalid);
    if (invalid) {
      emailField.focus();
      return;
    }

    setPending(true);
    try {
      const member = await addMember(workspaceId, email, role);
      onAdded(member);
      emailField.value = '';
      toast(`${member.user.name} added.`);
    } catch (caught) {
      const messages = addErrorMessages(caught);
      setFieldError(messages.field);
      setFormError(messages.form);
      if (messages.field) emailField.focus();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="off"
            placeholder="name@example.com"
            hint={`They need a ${SITE_NAME} account first.`}
            error={fieldError || undefined}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={roleId} className="text-xs font-medium text-ink-muted">
            Role
          </label>
          <RoleSelect id={roleId} name="role" defaultValue="EDITOR" className="sm:w-32" />
        </div>
      </div>
      <FormAlert message={formError} />
      <div>
        <button type="submit" disabled={pending} className={buttonStyles('primary')}>
          {pending ? 'Adding…' : 'Add member'}
        </button>
      </div>
    </form>
  );
}
