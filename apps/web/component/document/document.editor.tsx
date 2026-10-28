'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extensions';
import Collaboration from '@tiptap/extension-collaboration';
import * as Y from 'yjs';
import './document.editor.css';

export function DocumentEditor({ ydoc, editable }: { ydoc: Y.Doc; editable: boolean }) {
  const editor = useEditor({
    extensions: [
      // Yjs keeps its own undo history, so the built-in one has to go.
      StarterKit.configure({ heading: { levels: [1, 2, 3] }, undoRedo: false }),
      Placeholder.configure({
        placeholder: ({ node }) =>
          node.type.name === 'heading' ? 'Heading' : 'Start your journey here...',
      }),
      Collaboration.configure({ document: ydoc }),
    ],
    editable,
    immediatelyRender: false,
  });

  return <EditorContent editor={editor} className="mt-6" />;
}
