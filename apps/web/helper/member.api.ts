import { api } from '@/lib/axios';
import { Member, MemberRole } from '@/model/member.model';

export async function getMembers(workspaceId: string) {
  const { data } = await api.get<Member[]>(`/workspaces/${workspaceId}/members`);
  return data;
}

export async function addMember(workspaceId: string, email: string, role: MemberRole) {
  const { data } = await api.post<Member>(`/workspaces/${workspaceId}/members`, { email, role });
  return data;
}

export async function changeMemberRole(workspaceId: string, userId: string, role: MemberRole) {
  const { data } = await api.patch<Member>(`/workspaces/${workspaceId}/members/${userId}`, {
    role,
  });
  return data;
}

export async function removeMember(workspaceId: string, userId: string) {
  await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
}
