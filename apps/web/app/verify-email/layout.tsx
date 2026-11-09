import { AuthShell } from '@/component/auth/auth.shell';

export default function VerifyEmailLayout({ children }: LayoutProps<'/verify-email'>) {
  return <AuthShell>{children}</AuthShell>;
}
