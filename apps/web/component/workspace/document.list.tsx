'use client';

import { buttonStyles } from '@/component/ui/button.styles';
import { useDocuments } from '@/component/workspace/use.documents';
import { WorkspaceDocument } from '@/model/document.model';

function DocumentRows({ documents }: { documents: WorkspaceDocument[] }) {
  // Child pages wait for the expandable tree.
  const topLevel = documents.filter((doc) => doc.parentId === null);
  if (topLevel.length === 0) {
    return <p className="px-2 py-2 text-body-sm text-ink-muted">No pages yet.</p>;
  }
  return (
    <ul>
      {topLevel.map((doc) => (
        <li
          key={doc.id}
          title={doc.title}
          className="truncate px-2 py-2 text-body-sm text-ink-secondary"
        >
          {doc.title}
        </li>
      ))}
    </ul>
  );
}

function DocumentsBody({ workspaceId }: { workspaceId: string }) {
  const { state, retry } = useDocuments(workspaceId);

  if (state.kind === 'loading') {
    return (
      <p role="status" className="px-2 py-2 text-body-sm text-ink-muted">
        Loading pages…
      </p>
    );
  }
  if (state.kind === 'error') {
    return (
      <div role="alert" className="px-2 py-2">
        <p className="text-body-sm text-ink">Couldn&apos;t load pages.</p>
        <button type="button" onClick={retry} className={buttonStyles('utility', 'mt-2')}>
          Try again
        </button>
      </div>
    );
  }
  return <DocumentRows documents={state.documents} />;
}

export function DocumentList({ workspaceId }: { workspaceId: string }) {
  return (
    <section aria-labelledby="pages-heading" className="mt-4 min-h-0 flex-1 overflow-y-auto">
      <h2 id="pages-heading" className="px-2 pb-1 text-xs font-medium text-ink-muted">
        Pages
      </h2>
      <DocumentsBody workspaceId={workspaceId} />
    </section>
  );
}
