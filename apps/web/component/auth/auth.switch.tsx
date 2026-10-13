import Link from 'next/link';

type Props = {
  question: string;
  href: '/signin' | '/register';
  label: string;
};

export function AuthSwitch({ question, href, label }: Props) {
  return (
    <p className="text-center text-sm text-ink-muted">
      {question}{' '}
      <Link
        href={href}
        className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-2"
      >
        {label}
      </Link>
    </p>
  );
}
