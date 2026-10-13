import type { Metadata } from 'next';
import { RegisterForm } from '@/component/auth/register.form';

export const metadata: Metadata = {
  title: 'Create your account',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
