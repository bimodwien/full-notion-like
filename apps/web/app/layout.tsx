import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppToaster } from '@/component/ui/toaster';
import { AuthProvider } from '@/context/auth.context';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';

// DESIGN.md names Inter as the stand-in for NotionInter.
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
        <AppToaster />
      </body>
    </html>
  );
}
