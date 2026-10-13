import { AuthShell } from '@/component/auth/auth.shell';

export default function RegisterLayout({ children }: LayoutProps<'/register'>) {
  return <AuthShell>{children}</AuthShell>;
}
