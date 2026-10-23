import { useId } from 'react';
import { FIELD_LABEL, SELECT } from '@/component/ui/select.styles';
import { MembersState } from '@/component/workspace/members/use.members';
import { Member } from '@/model/member.model';

type OptionsProps = { members: Member[]; value: string | null; emptyLabel: string };

function PeopleOptions({ members, value, emptyLabel }: OptionsProps) {
  // Removing someone from the workspace doesn't clear the tasks they were on.
  const isFormerMember = value !== null && !members.some(({ user }) => user.id === value);
  return (
    <>
      <option value="">{emptyLabel}</option>
      {isFormerMember && <option value={value}>Former member</option>}
      {members.map(({ user }) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </>
  );
}

type Props = {
  label: string;
  name: 'assigneeId' | 'reviewerId';
  emptyLabel: string;
  value: string | null;
  members: MembersState;
};

export function PersonField({ label, name, emptyLabel, value, members }: Props) {
  const id = useId();
  const noteId = `${id}-note`;
  const failed = members.kind === 'error';

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={FIELD_LABEL}>
        {label}
      </label>
      {/* Keyed by load state: defaultValue only applies when the select mounts with its options. */}
      <select
        key={members.kind}
        id={id}
        name={name}
        defaultValue={value ?? ''}
        disabled={members.kind !== 'ready'}
        aria-describedby={failed ? noteId : undefined}
        className={SELECT}
      >
        {members.kind === 'ready' ? (
          <PeopleOptions members={members.members} value={value} emptyLabel={emptyLabel} />
        ) : (
          <option value={value ?? ''}>{failed ? 'Unavailable' : 'Loading members…'}</option>
        )}
      </select>
      {failed && (
        <p id={noteId} className="text-xs text-ink-muted">
          Members couldn&apos;t load, so this stays as it is.
        </p>
      )}
    </div>
  );
}
