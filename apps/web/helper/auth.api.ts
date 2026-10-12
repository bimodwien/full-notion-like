import { api } from '@/lib/axios';
import { AuthToken, RegisterInput, RegisteredUser, LoginInput } from '@/model/auth.model';

export async function register(input: RegisterInput) {
  const { data } = await api.post<RegisteredUser>('/auth/register', input);
  return data;
}

export async function login(input: LoginInput) {
  const { data } = await api.post<AuthToken>('/auth/login', input);
  return data;
}
