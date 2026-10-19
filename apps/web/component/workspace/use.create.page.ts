'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useWorkspaceDocuments } from '@/component/workspace/documents.context';
import { createDocument } from '@/helper/document.api';

// Shared by "New page" and the per-row "+": create, add to the sidebar, open it.
export function useCreatePage() {
  const router = useRouter();
  const { workspaceId, add } = useWorkspaceDocuments();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function create(parentId: string | null) {
    setBusy(true);
    setFailed(false);
    try {
      const created = await createDocument(workspaceId, parentId);
      add(created);
      router.push(`/workspaces/${workspaceId}/${created.id}`);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return { busy, failed, create };
}
