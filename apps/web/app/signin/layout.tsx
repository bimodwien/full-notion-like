import { AuthShell } from '@/component/auth/auth.shell';

export default function SignInLayout({ children }: LayoutProps<'/signin'>) {
  return <AuthShell>{children}</AuthShell>;
}
