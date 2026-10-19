import { DocumentView } from '@/component/document/document.view';

// Auth lives in localStorage, which the server can't read. Revisit after moving tokens to cookies.
export const instant = false;

export default function DocumentPage() {
  return <DocumentView />;
}
