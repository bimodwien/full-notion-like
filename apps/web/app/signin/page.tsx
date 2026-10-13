import type { Metadata } from 'next';
import { SigninForm } from '@/component/auth/signin.form';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default function SignInPage() {
  return <SigninForm />;
}
