import { isAxiosError } from 'axios';

const UNREACHABLE = "Can't reach the server. Check your connection and try again.";
const UNEXPECTED = 'Something went wrong on the server. Try again in a moment.';

const BY_STATUS: Record<number, string> = {
  401: "That email and password don't match an account.",
  409: 'An account with this email already exists. Sign in instead.',
};

// Nest's ValidationPipe sends `message` as an array, other exceptions as a string.
function apiMessage(data: unknown) {
  const message = (data as { message?: string | string[] } | null)?.message;
  return Array.isArray(message) ? message.join('. ') : message;
}

export function authErrorMessage(error: unknown) {
  if (!isAxiosError(error)) return UNEXPECTED;
  if (!error.response) return UNREACHABLE;

  const { status, data } = error.response;
  if (status === 400) return apiMessage(data) ?? UNEXPECTED;
  return BY_STATUS[status] ?? UNEXPECTED;
}
