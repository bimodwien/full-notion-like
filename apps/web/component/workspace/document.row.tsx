'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useWorkspaceDocuments } from '@/component/workspace/documents.context';
import { useCreatePage } from '@/component/workspace/use.create.page';
import { WorkspaceDocument } from '@/model/document.model';
import { childrenOf } from '@/util/document.tree';

export type PageTree = {
  documents: WorkspaceDocument[];
  activeId?: string;
  // Pages above the open one; they start open so the open page is visible.
  trail: Set<string>;
};

const INDENT_PX = 12;
// 28px wide keeps nested titles readable in a 240px sidebar; height stays 44px.
const ROW_ICON =
  'grid h-11 w-7 shrink-0 cursor-pointer place-items-center rounded-sm text-ink-muted hover:text-ink';

type ToggleProps = { title: string; open: boolean; hasChildren: boolean; onToggle: () => void };

function ToggleButton({ title, open, hasChildren, onToggle }: ToggleProps) {
  // Same width as the button so titles line up whether a page has children or not.
  if (!hasChildren) return <span aria-hidden="true" className="w-7 shrink-0" />;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-label={`Pages inside ${title}`}
      className={ROW_ICON}
    >
      <span aria-hidden="true">{open ? '▾' : '▸'}</span>
    </button>
  );
}

type AddProps = { title: string; busy: boolean; onAdd: () => void };

function AddSubpageButton({ title, busy, onAdd }: AddProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={busy}
      aria-label={`Add a page inside ${title}`}
      title="Add a page inside"
      // Hidden until the row is hovered or focused; touch screens have no hover, so always shown there.
      className={`${ROW_ICON} opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-coarse:opacity-100 disabled:cursor-wait`}
    >
      <span aria-hidden="true">+</span>
    </button>
  );
}

// Opens again whenever the open page moves somewhere below this row; the reader can still close it.
function useRowOpen(onTrail: boolean, activeId?: string) {
  const [open, setOpen] = useState(onTrail);
  const [revealedFor, setRevealedFor] = useState(onTrail ? activeId : undefined);
  if (onTrail && revealedFor !== activeId) {
    setRevealedFor(activeId);
    setOpen(true);
  }
  return [open, setOpen] as const;
}

type RowProps = { doc: WorkspaceDocument; tree: PageTree; depth: number };

export function DocumentRow({ doc, tree, depth }: RowProps) {
  const { canEdit } = useWorkspaceDocuments();
  const { busy, failed, create } = useCreatePage();
  const [open, setOpen] = useRowOpen(tree.trail.has(doc.id), tree.activeId);
  const children = childrenOf(tree.documents, doc.id);
  const active = doc.id === tree.activeId;
  const indent = { paddingLeft: depth * INDENT_PX };

  return (
    <li>
      <div
        style={indent}
        className={`group flex min-h-11 items-center rounded-sm pr-1 hover:bg-black/5 ${active ? 'bg-black/5' : ''}`}
      >
        <ToggleButton
          title={doc.title}
          open={open}
          hasChildren={children.length > 0}
          onToggle={() => setOpen((value) => !value)}
        />
        <Link
          href={`/workspaces/${doc.workspaceId}/${doc.id}`}
          title={doc.title}
          aria-current={active ? 'page' : undefined}
          className={`flex min-h-11 min-w-0 flex-1 items-center pr-1 text-body-sm ${active ? 'font-medium text-ink' : 'text-ink-secondary'}`}
        >
          <span className="truncate">{doc.title}</span>
        </Link>
        {canEdit && <AddSubpageButton title={doc.title} busy={busy} onAdd={() => create(doc.id)} />}
      </div>
      {failed && (
        <p role="alert" style={indent} className="pb-1 pl-7 text-body-sm text-ink">
          Couldn&apos;t add a page. Try again.
        </p>
      )}
      {open && <SubpageList pages={children} tree={tree} depth={depth + 1} />}
    </li>
  );
}

function SubpageList({
  pages,
  tree,
  depth,
}: {
  pages: WorkspaceDocument[];
  tree: PageTree;
  depth: number;
}) {
  if (pages.length === 0) return null;
  return (
    <ul>
      {pages.map((page) => (
        <DocumentRow key={page.id} doc={page} tree={tree} depth={depth} />
      ))}
    </ul>
  );
}
