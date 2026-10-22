'use client';

import { useParams } from 'next/navigation';
import { buttonStyles } from '@/component/ui/button.styles';
import { DocumentRow, PageTree } from '@/component/document/document.row';
import { NewPageButton } from '@/component/document/new.page.button';
import { useWorkspaceDocuments } from '@/component/document/documents.context';
import { WorkspaceDocument } from '@/model/document.model';
import { ancestorIds, childrenOf } from '@/util/document.tree';

function DocumentRows({ documents }: { documents: WorkspaceDocument[] }) {
  const { documentId } = useParams<{ documentId?: string }>();
  const topLevel = childrenOf(documents, null);
  if (topLevel.length === 0) {
    return <p className="px-2 py-2 text-body-sm text-ink-muted">No pages yet.</p>;
  }
  const tree: PageTree = {
    documents,
    activeId: documentId,
    trail: ancestorIds(documents, documentId),
  };
  return (
    <ul>
      {topLevel.map((doc) => (
        <DocumentRow key={doc.id} doc={doc} tree={tree} depth={0} />
      ))}
    </ul>
  );
}

function DocumentsBody() {
  const { canEdit, state, retry } = useWorkspaceDocuments();

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
  return (
    <>
      <DocumentRows documents={state.documents} />
      {canEdit && <NewPageButton />}
    </>
  );
}

export function DocumentList() {
  return (
    <section aria-labelledby="pages-heading" className="mt-4 min-h-0 flex-1 overflow-y-auto">
      <h2 id="pages-heading" tabIndex={-1} className="px-2 pb-1 text-xs font-medium text-ink-muted">
        Pages
      </h2>
      <DocumentsBody />
    </section>
  );
}
