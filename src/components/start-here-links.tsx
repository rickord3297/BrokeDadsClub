import Link from "next/link";
import { START_HERE_SLUGS, getGuide } from "@/lib/guides";

/** Compact links to the curated start-here guides. */
export function StartHereLinks({
  className = "text-sm leading-6 text-ink-soft",
}: {
  className?: string;
}) {
  const picks = START_HERE_SLUGS.map((slug) => getGuide(slug)).filter(
    (guide): guide is NonNullable<typeof guide> => guide != null,
  );
  if (picks.length === 0) return null;

  return (
    <p className={className}>
      Start here:{" "}
      {picks.map((guide, index) => (
        <span key={guide.slug}>
          {index > 0 ? ", " : null}
          <Link
            href={`/guides/${guide.slug}`}
            className="font-medium underline decoration-current/30 underline-offset-2 hover:opacity-80"
          >
            {guide.title}
          </Link>
        </span>
      ))}
    </p>
  );
}
