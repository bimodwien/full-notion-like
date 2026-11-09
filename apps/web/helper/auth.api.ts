import axios from 'axios';
import { api } from '@/lib/axios';
import { RegisterInput, RegisteredUser, LoginInput, UserProfile } from '@/model/auth.model';

export async function register(input: RegisterInput) {
  const { data } = await api.post<RegisteredUser>('/auth/register', input);
  return data;
}

// The API answers with cookies, not tokens.
export async function login(input: LoginInput) {
  await api.post('/auth/login', input);
}

export async function verifyEmail(token: string) {
  await api.post('/auth/verify-email', { token });
}

export async function resendVerification(email: string) {
  await api.post('/auth/resend-verification', { email });
}

export async function getProfile() {
  const { data } = await api.get<UserProfile>('/auth/me');
  return data;
}

export async function logout() {
  await api.post('/auth/logout');
}

// Plain axios, not `api`: a 401 here must not trigger another refresh.
export async function refreshSession() {
  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, undefined, {
    withCredentials: true,
  });
}
