import { useId } from 'react';
import { FIELD_LABEL, SELECT } from '@/component/ui/select.styles';
import { useWorkspaceDocuments } from '@/component/document/documents.context';
import { WorkspaceDocument } from '@/model/document.model';
import { pagesInTreeOrder } from '@/util/document.tree';

const INDENT = '   ';

function PageOptions({ documents }: { documents: WorkspaceDocument[] }) {
  return (
    <>
      <option value="">No page</option>
      {pagesInTreeOrder(documents).map(({ doc, depth }) => (
        <option key={doc.id} value={doc.id}>
          {INDENT.repeat(depth)}
          {doc.title || 'Untitled'}
        </option>
      ))}
    </>
  );
}

// Deleting a page clears documentId on the server, so a stale id falling back to "No page" is right.
export function PageField({ value }: { value: string | null }) {
  const { state } = useWorkspaceDocuments();
  const id = useId();
  const noteId = `${id}-note`;
  const failed = state.kind === 'error';

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={FIELD_LABEL}>
        Page
      </label>
      <select
        key={state.kind}
        id={id}
        name="documentId"
        defaultValue={value ?? ''}
        disabled={state.kind !== 'ready'}
        aria-describedby={failed ? noteId : undefined}
        className={SELECT}
      >
        {state.kind === 'ready' ? (
          <PageOptions documents={state.documents} />
        ) : (
          <option value={value ?? ''}>{failed ? 'Unavailable' : 'Loading pages…'}</option>
        )}
      </select>
      {failed && (
        <p id={noteId} className="text-xs text-ink-muted">
          Pages couldn&apos;t load, so this stays as it is.
        </p>
      )}
    </div>
  );
}
