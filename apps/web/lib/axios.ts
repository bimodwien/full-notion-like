import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken } from '@/util/token.storage';
import { refreshAccessToken } from '@/helper/token.refresh';

// Marks a request that was already retried once, so a second 401 doesn't loop.
type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    if (error.response?.status !== 401 || !original || original._retry) throw error;
    original._retry = true;
    const token = await refreshAccessToken();
    if (!token) throw error;
    original.headers.Authorization = `Bearer ${token}`;
    return api(original);
  },
);
