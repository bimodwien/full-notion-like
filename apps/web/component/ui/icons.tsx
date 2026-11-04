// One set for the whole app: 16px box, 1.5 stroke, colour from the surrounding text.
type IconProps = { className?: string };

function Icon({ className = '', children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-4 shrink-0 ${className}`.trim()}
    >
      {children}
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M6 4l4 4-4 4" />
    </Icon>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M8 3.5v9M3.5 8h9" />
    </Icon>
  );
}

export function EllipsisIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M3.5 8h.01M8 8h.01M12.5 8h.01" strokeWidth="2.5" />
    </Icon>
  );
}
