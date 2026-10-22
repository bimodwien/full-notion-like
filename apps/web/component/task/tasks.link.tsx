'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWorkspaceDocuments } from '@/component/document/documents.context';

export function TasksLink() {
  const { workspaceId } = useWorkspaceDocuments();
  const pathname = usePathname();
  const href = `/workspaces/${workspaceId}/tasks`;
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`mt-2 flex min-h-11 items-center gap-2 rounded-sm px-2 text-body-sm hover:bg-black/5 ${active ? 'bg-black/5 font-medium text-ink' : 'text-ink-secondary'}`}
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 text-ink-muted">
        <rect
          x="2.5"
          y="2.5"
          width="11"
          height="11"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path d="M5.5 8.2l1.7 1.7 3.3-3.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
      </svg>
      Tasks
    </Link>
  );
}
