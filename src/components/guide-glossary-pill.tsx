import Link from "next/link";

/** Inline badge for coined BDC terms. Hint lives in data-hint + CSS, not in the text flow. */
export function GuideGlossaryPill({
  slug,
  label,
  hint,
}: {
  slug: string;
  label: string;
  hint: string;
}) {
  return (
    <Link
      href={`/guides/${slug}`}
      className="guide-glossary-pill"
      data-hint={hint}
      aria-label={`${label}: ${hint}`}
      title={hint}
    >
      {label}
    </Link>
  );
}
