// Auth lives in localStorage, which the server can't read. Revisit after moving tokens to cookies.
export const instant = false;

export default function WorkspacePage() {
  return <p className="text-body-sm text-ink-muted">Pick a page from the sidebar to open it.</p>;
}
