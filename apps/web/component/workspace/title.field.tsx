'use client';

import { KeyboardEvent, useRef, useState } from 'react';
import { useWorkspaceDocuments } from '@/component/workspace/documents.context';
import { updateDocument } from '@/helper/document.api';
import { WorkspaceDocument } from '@/model/document.model';

const FALLBACK_TITLE = 'Untitled';

export function TitleField({ document }: { document: WorkspaceDocument }) {
  const { rename } = useWorkspaceDocuments();
  const [draft, setDraft] = useState(document.title);
  const [failed, setFailed] = useState(false);
  const saved = useRef(document.title);

  // Rename the sidebar row right away; put the old title back if the API refuses.
  async function save() {
    const title = draft.trim() || FALLBACK_TITLE;
    setDraft(title);
    if (title === saved.current) return;
    const previous = saved.current;
    saved.current = title;
    rename(document.id, title);
    setFailed(false);
    try {
      await updateDocument(document.workspaceId, document.id, { title });
    } catch {
      saved.current = previous;
      rename(document.id, previous);
      setDraft(previous);
      setFailed(true);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) event.currentTarget.blur();
    if (event.key === 'Escape') setDraft(saved.current);
  }

  return (
    <>
      <h1>
        <input
          aria-label="Page title"
          value={draft}
          maxLength={200}
          placeholder={FALLBACK_TITLE}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={save}
          onKeyDown={handleKeyDown}
          className="-mx-1 w-[calc(100%+0.5rem)] rounded-sm bg-transparent px-1 text-h1 text-ink placeholder:text-ink-faint hover:bg-black/5"
        />
      </h1>
      {failed && (
        <p role="alert" className="mt-2 text-body-sm text-error">
          Couldn&apos;t save the title, so it&apos;s back to the last saved one.
        </p>
      )}
    </>
  );
}
