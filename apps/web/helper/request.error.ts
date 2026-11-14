import { isAxiosError } from 'axios';

export const UNREACHABLE = "Can't reach the server. Check your connection and try again.";
export const UNEXPECTED = 'Something went wrong on the server. Try again in a moment.';
export const TOO_MANY = 'Too many attempts. Wait a few minutes and try again.';
const FORBIDDEN = 'Only the workspace owner can do this.';
// Nest's ValidationPipe sends `message` as an array, other exceptions as a string.
export function apiMessage(data: unknown) {
  const message = (data as { message?: string | string[] } | null)?.message;
  return Array.isArray(message) ? message.join('. ') : message;
}

export function requestErrorMessage(error: unknown) {
  if (!isAxiosError(error)) return UNEXPECTED;
  if (!error.response) return UNREACHABLE;

  const { status, data } = error.response;
  if (status === 400) return apiMessage(data) ?? UNEXPECTED;
  if (status === 403) return FORBIDDEN;
  if (status === 429) return TOO_MANY;
  return UNEXPECTED;
}
