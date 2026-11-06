'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export function NavShell({ children }: { children: ReactNode }) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const border = scrolled ? 'border-hairline' : 'border-transparent';

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="absolute top-0 h-px w-px" />
      <header
        className={`sticky top-0 z-10 border-b bg-canvas transition-colors motion-reduce:transition-none ${border}`}
      >
        {children}
      </header>
    </>
  );
}
