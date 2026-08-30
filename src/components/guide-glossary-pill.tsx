import Link from "next/link";

/** Inline badge for coined BDC terms with a hover/focus hint. */
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
      className="guide-glossary-pill group"
      title={hint}
    >
      <span className="guide-glossary-pill-label">{label}</span>
      <span className="guide-glossary-pill-hint" role="tooltip">
        {hint}
      </span>
    </Link>
  );
}
