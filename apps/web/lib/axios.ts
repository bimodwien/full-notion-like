import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { refreshAccessToken } from '@/helper/token.refresh';

// Marks a request that was already retried once, so a second 401 doesn't loop.
type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// withCredentials sends the httpOnly auth cookies along to the API's origin.
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    if (error.response?.status !== 401 || !original || original._retry) throw error;
    original._retry = true;
    if (!(await refreshAccessToken())) throw error;
    return api(original);
  },
);
