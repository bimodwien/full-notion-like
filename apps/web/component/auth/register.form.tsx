'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { AuthHeading } from '@/component/auth/auth.heading';
import { AuthSwitch } from '@/component/auth/auth.switch';
import { buttonStyles } from '@/component/ui/button.styles';
import { FormAlert } from '@/component/ui/form.alert';
import { TextField } from '@/component/ui/text.field';
import { useAuth } from '@/context/auth.context';
import { registerAndLogin } from '@/helper/auth.api';
import { authErrorMessage } from '@/helper/auth.error';
import { RegisterInput } from '@/model/auth.model';
import { FieldErrors, validateRegister } from '@/util/auth.validation';
import { focusFirstInvalid } from '@/util/form.focus';

function readInput(form: HTMLFormElement): RegisterInput {
  const data = new FormData(form);
  return {
    name: String(data.get('name')).trim(),
    email: String(data.get('email')).trim(),
    password: String(data.get('password')),
  };
}

function useRegisterForm() {
  const { signIn } = useAuth();
  const [errors, setErrors] = useState<FieldErrors<RegisterInput>>({});
  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = readInput(form);
    const found = validateRegister(input);
    setErrors(found);
    setFormError('');
    if (focusFirstInvalid(form, found)) return;

    setPending(true);
    try {
      // GuestOnly redirects once the status flips, so `pending` stays on until then.
      await registerAndLogin(input);
      signIn();
      toast('Account created.');
    } catch (error) {
      setFormError(authErrorMessage(error));
      setPending(false);
    }
  }

  return { errors, formError, pending, handleSubmit };
}

export function RegisterForm() {
  const { errors, formError, pending, handleSubmit } = useRegisterForm();

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <AuthHeading action="Create your account" />
      <TextField
        label="Name"
        name="name"
        autoComplete="name"
        placeholder="Enter your name…"
        error={errors.name}
      />
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
        autoComplete="new-password"
        placeholder="Choose a password…"
        hint="At least 6 characters."
        error={errors.password}
      />
      <FormAlert message={formError} />
      <button type="submit" disabled={pending} className={buttonStyles('primary', 'mt-2 w-full')}>
        {pending ? 'Creating account…' : 'Create account'}
      </button>
      <AuthSwitch question="Already have an account?" href="/signin" label="Sign in" />
    </form>
  );
}
