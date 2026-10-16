// Auth lives in localStorage, which the server can't read. Revisit after moving tokens to cookies.
export const instant = false;

export default function WorkspacePage() {
  return <p className="text-base text-ink-muted">Pick a page from the sidebar to open it.</p>;
}
