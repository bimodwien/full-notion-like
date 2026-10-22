'use client';

import { useEffect, useState } from 'react';
import { getMembers } from '@/helper/member.api';
import { Member, MemberRole } from '@/model/member.model';

export type MembersState =
  { kind: 'loading' } | { kind: 'error' } | { kind: 'ready'; members: Member[] };

export function useMembers(workspaceId: string) {
  const [state, setState] = useState<MembersState>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getMembers(workspaceId)
      .then((members) => {
        if (active) setState({ kind: 'ready', members });
      })
      .catch(() => {
        if (active) setState({ kind: 'error' });
      });
    return () => {
      active = false;
    };
  }, [workspaceId, attempt]);

  function retry() {
    setState({ kind: 'loading' });
    setAttempt((count) => count + 1);
  }

  function updateList(change: (members: Member[]) => Member[]) {
    setState((current) =>
      current.kind === 'ready' ? { kind: 'ready', members: change(current.members) } : current,
    );
  }

  function add(member: Member) {
    updateList((members) => [...members, member]);
  }

  function setRole(userId: string, role: MemberRole) {
    updateList((members) =>
      members.map((member) => (member.user.id === userId ? { ...member, role } : member)),
    );
  }

  function remove(userId: string) {
    updateList((members) => members.filter(({ user }) => user.id !== userId));
  }

  return { state, retry, add, setRole, remove };
}

export type MembersApi = ReturnType<typeof useMembers>;
