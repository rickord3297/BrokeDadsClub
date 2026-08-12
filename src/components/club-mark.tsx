export function ClubMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="32" cy="32" r="29" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="23" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path
        d="M18 36c3-9 8-14 14-14s11 5 14 14"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <path
        d="M24 38.5c2.2 4 5.2 6 8 6s5.8-2 8-6"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <path
        d="M22 28h6M36 28h6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
