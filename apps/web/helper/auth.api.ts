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

// The register endpoint returns the user without tokens, so sign in right after.
export async function registerAndLogin(input: RegisterInput) {
  await register(input);
  return login({ email: input.email, password: input.password });
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
