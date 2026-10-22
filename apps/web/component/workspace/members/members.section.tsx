'use client';

import { RefObject, useRef } from 'react';
import { buttonStyles } from '@/component/ui/button.styles';
import { AddMemberForm } from '@/component/workspace/members/add.member.form';
import { MemberRow } from '@/component/workspace/members/member.row';
import { MembersApi, useMembers } from '@/component/workspace/members/use.members';

type BodyProps = {
  workspaceId: string;
  members: MembersApi;
  heading: RefObject<HTMLHeadingElement | null>;
};

function MembersList({ workspaceId, members, heading }: BodyProps) {
  const { state, retry, setRole, remove } = members;

  if (state.kind === 'loading') {
    return (
      <p role="status" className="text-base text-ink-muted">
        Loading members…
      </p>
    );
  }
  if (state.kind === 'error') {
    return (
      <div role="alert">
        <p className="text-base text-ink">Couldn&apos;t load the members.</p>
        <button type="button" onClick={retry} className={buttonStyles('utility', 'mt-3')}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <ul className="divide-y divide-hairline border-y border-hairline">
        {state.members.map((member) => (
          <MemberRow
            key={member.user.id}
            workspaceId={workspaceId}
            member={member}
            onRoleChange={setRole}
            onRemoved={(userId) => {
              remove(userId);
              // The row and its focused button are gone, so give focus a place to land.
              heading.current?.focus();
            }}
          />
        ))}
      </ul>
      {state.members.length === 1 && (
        <p className="mt-3 text-body-sm text-ink-muted">
          Only you so far. Add someone by email to work on pages together.
        </p>
      )}
    </>
  );
}

export function MembersSection({ workspaceId }: { workspaceId: string }) {
  const members = useMembers(workspaceId);
  const heading = useRef<HTMLHeadingElement>(null);
  const count = members.state.kind === 'ready' ? members.state.members.length : undefined;

  return (
    <section aria-labelledby="members-heading" className="mt-12 border-t border-hairline pt-8">
      <h2 id="members-heading" className="text-h3 text-ink">
        Members
      </h2>
      <p className="mt-2 text-base text-ink-muted">
        Editors can add and change pages. Viewers can only read them.
      </p>
      <div className="mt-6">
        <AddMemberForm workspaceId={workspaceId} onAdded={members.add} />
      </div>
      <h3 ref={heading} tabIndex={-1} className="mt-8 mb-2 text-base font-semibold text-ink">
        People with access{count !== undefined && ` (${count})`}
      </h3>
      <MembersList workspaceId={workspaceId} members={members} heading={heading} />
    </section>
  );
}
