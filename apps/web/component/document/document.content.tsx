'use client';

import { buttonStyles } from '@/component/ui/button.styles';
import { useWorkspaceDocuments } from '@/component/document/documents.context';
import { DocumentEditor } from '@/component/document/document.editor';
import { useDocumentContent } from '@/component/document/use.document.content';
import { useContentAutosave } from '@/component/document/use.content.autosave';
import { useDocumentSync } from '@/component/document/use.document.sync';

export function DocumentContent({
  documentId,
  editable,
}: {
  documentId: string;
  editable: boolean;
}) {
  const { workspaceId } = useWorkspaceDocuments();
  const { state, retry } = useDocumentContent(workspaceId, documentId);
  const ydoc = state.kind === 'ready' ? state.ydoc : null;
  useContentAutosave(workspaceId, documentId, editable ? ydoc : null);
  useDocumentSync(workspaceId, documentId, ydoc);

  if (state.kind === 'loading') {
    return (
      <p role="status" className="mt-6 text-base text-ink-muted">
        Loading page content…
      </p>
    );
  }
  if (state.kind === 'error') {
    return (
      <div role="alert" className="mt-6">
        <p className="text-base text-ink">Couldn&apos;t load this page&apos;s content.</p>
        <button type="button" onClick={retry} className={buttonStyles('utility', 'mt-3')}>
          Try again
        </button>
      </div>
    );
  }
  return <DocumentEditor ydoc={state.ydoc} editable={editable} />;
}
