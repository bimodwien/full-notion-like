import { isAxiosError } from 'axios';
import { apiMessage, TOO_MANY, UNEXPECTED, UNREACHABLE } from '@/helper/request.error';

const BY_STATUS: Record<number, string> = {
  401: "That email and password don't match an account.",
  409: 'An account with this email already exists. Sign in instead.',
  429: TOO_MANY,
};

// The API answers 403 on sign in only when the password is right but the email isn't verified.
export function isUnverified(error: unknown) {
  return isAxiosError(error) && error.response?.status === 403;
}

export function authErrorMessage(error: unknown) {
  if (!isAxiosError(error)) return UNEXPECTED;
  if (!error.response) return UNREACHABLE;

  const { status, data } = error.response;
  if (status === 400) return apiMessage(data) ?? UNEXPECTED;
  return BY_STATUS[status] ?? UNEXPECTED;
}
