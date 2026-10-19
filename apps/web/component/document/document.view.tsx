'use client';

import { useParams } from 'next/navigation';
import { buttonStyles } from '@/component/ui/button.styles';
import { DeletePageButton } from '@/component/document/delete.page.button';
import { useWorkspaceDocuments } from '@/component/document/documents.context';
import { TitleField } from '@/component/document/title.field';

function MissingPage() {
  return (
    <div>
      <h1 className="text-h3 text-ink">This page doesn&apos;t exist.</h1>
      <p className="mt-1 text-base text-ink-muted">
        It may have been deleted, or the link belongs to another workspace. Pick a page from the
        sidebar.
      </p>
    </div>
  );
}

function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert">
      <p className="text-base font-semibold text-ink">Couldn&apos;t load this page.</p>
      <p className="mt-1 text-base text-ink-muted">
        Check that you&apos;re online, then try again.
      </p>
      <button type="button" onClick={onRetry} className={buttonStyles('utility', 'mt-4')}>
        Try again
      </button>
    </div>
  );
}

function DocumentBody({ documentId }: { documentId: string }) {
  const { state, retry, canEdit } = useWorkspaceDocuments();

  if (state.kind === 'loading') {
    return (
      <p role="status" className="text-base text-ink-muted">
        Loading page…
      </p>
    );
  }
  if (state.kind === 'error') return <LoadError onRetry={retry} />;

  const document = state.documents.find((doc) => doc.id === documentId);
  if (!document) return <MissingPage />;
  if (!canEdit) return <h1 className="text-h1 wrap-break-word text-ink">{document.title}</h1>;
  return (
    <>
      <div className="mb-6 flex justify-end">
        <DeletePageButton document={document} />
      </div>
      {/* Keyed so switching pages resets the unsaved draft. */}
      <TitleField key={document.id} document={document} />
    </>
  );
}

export function DocumentView() {
  const { documentId } = useParams<{ documentId: string }>();
  return (
    <article className="mx-auto w-full max-w-360">
      <DocumentBody documentId={documentId} />
    </article>
  );
}
