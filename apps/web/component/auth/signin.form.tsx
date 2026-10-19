'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { AuthHeading } from '@/component/auth/auth.heading';
import { AuthSwitch } from '@/component/auth/auth.switch';
import { buttonStyles } from '@/component/ui/button.styles';
import { FormAlert } from '@/component/ui/form.alert';
import { TextField } from '@/component/ui/text.field';
import { useAuth } from '@/context/auth.context';
import { login } from '@/helper/auth.api';
import { authErrorMessage } from '@/helper/auth.error';
import { SITE_NAME } from '@/lib/site';
import { LoginInput } from '@/model/auth.model';
import { FieldErrors, validateLogin } from '@/util/auth.validation';
import { focusFirstInvalid } from '@/util/form.focus';

function readInput(form: HTMLFormElement): LoginInput {
  const data = new FormData(form);
  return {
    email: String(data.get('email')).trim(),
    password: String(data.get('password')),
  };
}

function useSigninForm() {
  const { signIn } = useAuth();
  const [errors, setErrors] = useState<FieldErrors<LoginInput>>({});
  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = readInput(form);
    const found = validateLogin(input);
    setErrors(found);
    setFormError('');
    if (focusFirstInvalid(form, found)) return;

    setPending(true);
    try {
      // GuestOnly redirects once the status flips, so `pending` stays on until then.
      signIn(await login(input));
      toast('Signed in.');
    } catch (error) {
      setFormError(authErrorMessage(error));
      setPending(false);
    }
  }

  return { errors, formError, pending, handleSubmit };
}

export function SigninForm() {
  const { errors, formError, pending, handleSubmit } = useSigninForm();

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <AuthHeading action={`Sign in to ${SITE_NAME}`} />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Enter your email address…"
        error={errors.email}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password…"
        error={errors.password}
      />
      <FormAlert message={formError} />
      <button type="submit" disabled={pending} className={buttonStyles('primary', 'mt-2 w-full')}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
      <AuthSwitch question="New here?" href="/register" label="Create an account" />
    </form>
  );
}
