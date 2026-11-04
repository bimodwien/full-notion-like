'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useWorkspaceAccess } from '@/component/workspace/workspace.access.context';
import { PageActions } from '@/component/document/page.actions';
import { REVEAL_ON_ROW, ROW_ICON } from '@/component/document/row.styles';
import { useCreatePage } from '@/component/document/use.create.page';
import { ChevronRightIcon, PlusIcon } from '@/component/ui/icons';
import { WorkspaceDocument } from '@/model/document.model';
import { childrenOf } from '@/util/document.tree';

export type PageTree = {
  documents: WorkspaceDocument[];
  activeId?: string;
  // Pages above the open one; they start open so the open page is visible.
  trail: Set<string>;
};

const INDENT_PX = 12;

type ToggleProps = { title: string; open: boolean; hasChildren: boolean; onToggle: () => void };

function ToggleButton({ title, open, hasChildren, onToggle }: ToggleProps) {
  // Same width as the button so titles line up whether a page has children or not.
  if (!hasChildren) return <span aria-hidden="true" className="w-8 shrink-0" />;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-label={`Pages inside ${title}`}
      className={`${ROW_ICON} w-8`}
    >
      <ChevronRightIcon
        className={`transition-transform motion-reduce:transition-none ${open ? 'rotate-90' : ''}`}
      />
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
      className={`${ROW_ICON} w-7 ${REVEAL_ON_ROW} disabled:cursor-wait`}
    >
      <PlusIcon />
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
  const { canEdit } = useWorkspaceAccess();
  const { busy, failed, create } = useCreatePage();
  const [open, setOpen] = useRowOpen(tree.trail.has(doc.id), tree.activeId);
  const children = childrenOf(tree.documents, doc.id);
  const active = doc.id === tree.activeId;
  const indent = { paddingLeft: depth * INDENT_PX };

  return (
    <li>
      <div
        style={indent}
        className={`group flex items-center rounded-sm pr-1 transition-colors hover:bg-black/5 ${active ? 'bg-black/5' : ''}`}
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
          className={`flex min-h-9 pointer-coarse:min-h-11 min-w-0 flex-1 items-center pr-1 text-body-sm ${active ? 'font-medium text-ink' : 'text-ink-secondary'}`}
        >
          <span className="truncate">{doc.title}</span>
        </Link>
        {canEdit && (
          <>
            <PageActions doc={doc} />
            <AddSubpageButton title={doc.title} busy={busy} onAdd={() => create(doc.id)} />
          </>
        )}
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
  // The hairline sits under the parent's toggle (16px in from its row) and marks how deep these pages go.
  return (
    <ul className="relative">
      <span
        aria-hidden="true"
        style={{ left: depth * INDENT_PX + 4 }}
        className="absolute inset-y-0 w-px bg-hairline"
      />
      {pages.map((page) => (
        <DocumentRow key={page.id} doc={page} tree={tree} depth={depth} />
      ))}
    </ul>
  );
}
