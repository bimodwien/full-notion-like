import axios from 'axios';
import { api } from '@/lib/axios';
import {
  AuthToken,
  RegisterInput,
  RegisteredUser,
  LoginInput,
  UserProfile,
} from '@/model/auth.model';

export async function register(input: RegisterInput) {
  const { data } = await api.post<RegisteredUser>('/auth/register', input);
  return data;
}

export async function login(input: LoginInput) {
  const { data } = await api.post<AuthToken>('/auth/login', input);
  return data;
}

// The register endpoint returns the user without tokens, so sign in right after.
export async function registerAndLogin(input: RegisterInput) {
  await register(input);
  return login({ email: input.email, password: input.password });
}

export async function getProfile() {
  const { data } = await api.get<UserProfile>('/auth/me');
  return data;
}

export async function logout(refreshToken: string) {
  await api.post('/auth/logout', { refreshToken });
}

export async function refreshTokens(refreshToken: string) {
  const { data } = await axios.post<AuthToken>(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    refreshToken,
  });
  return data;
}
