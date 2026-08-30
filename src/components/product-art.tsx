import type { ProductArt } from "@/lib/products";

export function ProductArt({
  art,
  className = "h-full w-full",
}: {
  art: ProductArt;
  className?: string;
}) {
  const common = "h-full w-full";

  if (art === "tee") {
    return (
      <svg viewBox="0 0 200 200" className={className || common} aria-hidden>
        <rect width="200" height="200" fill="#2c5f63" />
        <path
          d="M62 58 86 48l14 16 14-16 24 10-8 22v72H70V80z"
          fill="#f3ede3"
        />
        <text
          x="100"
          y="118"
          textAnchor="middle"
          fill="#2c5f63"
          fontSize="18"
          fontFamily="Oswald, sans-serif"
          letterSpacing="2"
        >
          BDC
        </text>
      </svg>
    );
  }

  if (art === "hoodie") {
    return (
      <svg viewBox="0 0 200 200" className={className || common} aria-hidden>
        <rect width="200" height="200" fill="#2c5f63" />
        <path
          d="M70 70c0-18 13-30 30-30s30 12 30 30v10h18l-8 78H60l-8-78h18z"
          fill="#d97b51"
        />
        <path d="M88 72h24v38H88z" fill="#2c5f63" opacity="0.25" />
      </svg>
    );
  }

  if (art === "cap") {
    return (
      <svg viewBox="0 0 200 200" className={className || common} aria-hidden>
        <rect width="200" height="200" fill="#d97b51" />
        <ellipse cx="100" cy="108" rx="58" ry="16" fill="#1c1915" />
        <path d="M52 108c4-32 22-48 48-48s44 16 48 48H52z" fill="#f3ede3" />
        <circle cx="100" cy="86" r="6" fill="#2c5f63" />
      </svg>
    );
  }

  if (art === "patch") {
    return (
      <svg viewBox="0 0 200 200" className={className || common} aria-hidden>
        <rect width="200" height="200" fill="#f3ede3" />
        <circle cx="100" cy="100" r="78" fill="#2c5f63" stroke="#d97b51" strokeWidth="10" />
        <text
          x="100"
          y="168"
          textAnchor="middle"
          fill="#f3ede3"
          fontSize="11"
          fontFamily="Oswald, sans-serif"
          letterSpacing="1.5"
        >
          BROKE DADS CLUB
        </text>
      </svg>
    );
  }

  if (art === "mug") {
    return (
      <svg viewBox="0 0 200 200" className={className || common} aria-hidden>
        <rect width="200" height="200" fill="#d4a84b" />
        <path
          d="M68 62h56v78c0 10-8 18-18 18H86c-10 0-18-8-18-18z"
          fill="#f3ede3"
        />
        <path
          d="M124 78h16c10 0 16 8 16 18s-6 18-16 18h-16"
          stroke="#1c1915"
          strokeWidth="8"
          fill="none"
        />
        <path d="M78 58c6-10 14-16 22-16" stroke="#1c1915" strokeWidth="4" fill="none" />
      </svg>
    );
  }

  if (art === "tote") {
    return (
      <svg viewBox="0 0 200 200" className={className || common} aria-hidden>
        <rect width="200" height="200" fill="#c4a574" />
        <path d="M58 72h84v86H58z" fill="#f3ede3" />
        <path
          d="M72 72c0-18 12-28 28-28s28 10 28 28"
          stroke="#1c1915"
          strokeWidth="8"
          fill="none"
        />
        <circle cx="100" cy="108" r="14" fill="#2c5f63" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 200" className={className || common} aria-hidden>
      <rect width="200" height="200" fill="#1c1915" />
      <rect x="46" y="52" width="48" height="48" rx="6" fill="#d97b51" />
      <rect x="106" y="52" width="48" height="48" rx="6" fill="#d4a84b" />
      <rect x="46" y="112" width="48" height="48" rx="6" fill="#2c5f63" />
      <rect x="106" y="112" width="48" height="48" rx="6" fill="#f3ede3" />
    </svg>
  );
}
