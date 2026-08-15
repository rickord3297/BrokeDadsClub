import Link from "next/link";
import { getGuides } from "@/lib/guides";

export function RecapTopics({
  className = "text-sm leading-6 text-ink-soft",
}: {
  className?: string;
}) {
  const recent = getGuides().slice(0, 3);
  if (recent.length === 0) return null;

  return (
    <p className={className}>
      Worth using this week:{" "}
      {recent.map((guide, index) => (
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
