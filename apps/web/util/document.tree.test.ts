import { describe, expect, it } from 'vitest';
import { WorkspaceDocument } from '@/model/document.model';
import {
  ancestorIds,
  childrenOf,
  moveTargets,
  pagesInTreeOrder,
  subtreeIds,
} from '@/util/document.tree';

function page(id: string, parentId: string | null): WorkspaceDocument {
  return {
    id,
    workspaceId: 'w1',
    parentId,
    title: id,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

// home > (plans > q4), notes
const documents = [
  page('home', null),
  page('plans', 'home'),
  page('q4', 'plans'),
  page('notes', null),
];

const ids = (pages: { doc: WorkspaceDocument; depth: number }[]) =>
  pages.map(({ doc, depth }) => `${doc.id}:${depth}`);

describe('childrenOf', () => {
  it('lists top-level pages for a null parent', () => {
    expect(childrenOf(documents, null).map((d) => d.id)).toEqual(['home', 'notes']);
  });

  it('lists only direct children', () => {
    expect(childrenOf(documents, 'home').map((d) => d.id)).toEqual(['plans']);
  });
});

describe('ancestorIds', () => {
  it('collects every page above the open one', () => {
    expect([...ancestorIds(documents, 'q4')]).toEqual(['plans', 'home']);
  });

  it('is empty for a top-level page or no page', () => {
    expect(ancestorIds(documents, 'home').size).toBe(0);
    expect(ancestorIds(documents, undefined).size).toBe(0);
  });

  it('stops instead of looping forever on a broken parent chain', () => {
    const loop = [page('p', 'q'), page('q', 'p')];
    expect([...ancestorIds(loop, 'p')]).toEqual(['q', 'p']);
  });
});

describe('subtreeIds', () => {
  it('includes the page and everything nested under it', () => {
    expect([...subtreeIds(documents, 'home')].sort()).toEqual(['home', 'plans', 'q4']);
  });

  it('is just the page when it has no children', () => {
    expect([...subtreeIds(documents, 'notes')]).toEqual(['notes']);
  });
});

describe('pagesInTreeOrder', () => {
  it('lists pages in sidebar order with their depth', () => {
    expect(ids(pagesInTreeOrder(documents))).toEqual(['home:0', 'plans:1', 'q4:2', 'notes:0']);
  });
});

describe('moveTargets', () => {
  it('leaves out the moving page and its own subpages', () => {
    expect(ids(moveTargets(documents, 'plans'))).toEqual(['home:0', 'notes:0']);
  });
});
