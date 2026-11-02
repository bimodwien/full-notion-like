'use client';

import { useCallback } from 'react';
import { LoadedList, useLoadedList } from '@/component/ui/use.loaded.list';
import { getMembers } from '@/helper/member.api';
import { Member, MemberRole } from '@/model/member.model';

export type MembersState = LoadedList<Member>;

export function useMembers(workspaceId: string) {
  const load = useCallback(() => getMembers(workspaceId), [workspaceId]);
  const { state, retry, updateList } = useLoadedList(load);

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
