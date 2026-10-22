import { LoginInput, RegisterInput } from '@/model/auth.model';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Same minimum as RegisterDto in the API.
const PASSWORD_MIN = 6;

function emailError(email: string) {
  if (!email) return 'Enter your email address.';
  if (!EMAIL_SHAPE.test(email)) return 'Check the email address. It needs an @ and a domain.';
  return undefined;
}

export function validateLogin(input: LoginInput) {
  const errors: FieldErrors<LoginInput> = {};
  const email = emailError(input.email);
  if (email) errors.email = email;
  if (!input.password) errors.password = 'Enter your password.';
  return errors;
}

export function validateRegister(input: RegisterInput) {
  const errors: FieldErrors<RegisterInput> = {};
  if (!input.name) errors.name = 'Enter your name.';
  const email = emailError(input.email);
  if (email) errors.email = email;
  if (input.password.length < PASSWORD_MIN) {
    errors.password = `Use at least ${PASSWORD_MIN} characters.`;
  }
  return errors;
}
