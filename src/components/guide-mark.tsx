function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-7 w-7 text-pine"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function GuideMark({ category }: { category: string }) {
  switch (category) {
    case "Money":
      return (
        <Icon>
          <rect x="3" y="7" width="18" height="12" rx="2" />
          <circle cx="12" cy="13" r="2.2" />
          <path d="M7 7V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1" />
        </Icon>
      );
    case "Time":
      return (
        <Icon>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4.2L15 15" />
        </Icon>
      );
    case "Kids":
      return (
        <Icon>
          <circle cx="9" cy="8" r="2.2" />
          <circle cx="16" cy="9" r="1.8" />
          <path d="M4.5 18c.6-2.6 2.6-4 4.5-4s3.9 1.4 4.5 4" />
          <path d="M13 18c.4-1.8 1.7-3 3-3s2.5 1 3 3" />
        </Icon>
      );
    case "Work":
      return (
        <Icon>
          <rect x="4" y="8" width="16" height="11" rx="1.5" />
          <path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8" />
          <path d="M4 13h16" />
        </Icon>
      );
    case "Gear":
      return (
        <Icon>
          <path d="M14 7h6M17 4v6" />
          <path d="M4 16.5a3.5 3.5 0 0 0 7 0V8H4z" />
          <path d="M4 10h7" />
        </Icon>
      );
    default:
      return (
        <Icon>
          <path d="M6 4h9l3 3v13H6z" />
          <path d="M15 4v3h3" />
        </Icon>
      );
  }
}
