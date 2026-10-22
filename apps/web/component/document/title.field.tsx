'use client';

import { KeyboardEvent, RefObject, useLayoutEffect, useRef, useState } from 'react';
import { useWorkspaceDocuments } from '@/component/document/documents.context';
import { updateDocument } from '@/helper/document.api';
import { WorkspaceDocument } from '@/model/document.model';

const FALLBACK_TITLE = 'Untitled';

// A title is one line of text, so pasted line breaks become spaces.
function singleLine(value: string) {
  return value.replace(/\s*[\r\n]+\s*/g, ' ');
}

// Grows the textarea to fit its text, again whenever the text or the column width changes.
function useAutoHeight(ref: RefObject<HTMLTextAreaElement | null>, value: string) {
  useLayoutEffect(() => {
    const field = ref.current;
    if (!field) return;
    const fit = () => {
      field.style.height = 'auto';
      field.style.height = `${field.scrollHeight}px`;
    };
    fit();
    let width = field.clientWidth;
    const observer = new ResizeObserver(() => {
      if (field.clientWidth === width) return;
      width = field.clientWidth;
      fit();
    });
    observer.observe(field);
    return () => observer.disconnect();
  }, [ref, value]);
}

export function TitleField({ document }: { document: WorkspaceDocument }) {
  const { rename } = useWorkspaceDocuments();
  const [draft, setDraft] = useState(document.title);
  const [failed, setFailed] = useState(false);
  const saved = useRef(document.title);
  const field = useRef<HTMLTextAreaElement>(null);
  useAutoHeight(field, draft);

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

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.blur();
    }
    if (event.key === 'Escape') setDraft(saved.current);
  }

  return (
    <>
      <h1>
        <textarea
          ref={field}
          aria-label="Page title"
          rows={1}
          value={draft}
          maxLength={200}
          placeholder={FALLBACK_TITLE}
          onChange={(event) => setDraft(singleLine(event.target.value))}
          onBlur={save}
          onKeyDown={handleKeyDown}
          className="-mx-1 block w-[calc(100%+0.5rem)] resize-none overflow-hidden rounded-sm bg-transparent px-1 text-h1 text-ink placeholder:text-ink-faint hover:bg-black/5"
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
