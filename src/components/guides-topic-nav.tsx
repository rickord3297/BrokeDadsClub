import Link from "next/link";
import { topicSlugForCategory } from "@/lib/guide-topics";

export function GuidesTopicNav({
  categories,
  counts,
  total,
  activeCategory = "",
}: {
  categories: string[];
  counts: Record<string, number>;
  total: number;
  /** Empty = All guides hub */
  activeCategory?: string;
}) {
  const topics = ["", ...categories];

  return (
    <div
      className="flex flex-wrap gap-2 sm:gap-3"
      role="navigation"
      aria-label="Browse guides by topic"
    >
      {topics.map((value) => {
        const selected = value === activeCategory;
        const count = value ? (counts[value] ?? 0) : total;
        const label = value || "All";
        const topicSlug = value ? topicSlugForCategory(value) : null;
        const href = topicSlug ? `/guides/${topicSlug}` : "/guides";
        return (
          <Link
            key={value || "all-topics"}
            href={href}
            aria-current={selected ? "page" : undefined}
            className={
              selected
                ? "rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-sm ring-2 ring-ink ring-offset-2 ring-offset-paper sm:text-base"
                : "rounded-full border border-rule bg-paper px-4 py-2.5 text-sm font-medium text-ink transition hover:border-pine hover:text-pine sm:text-base"
            }
          >
            {label}
            <span
              className={
                selected
                  ? "ml-1.5 tabular-nums text-paper/70"
                  : "ml-1.5 tabular-nums text-ink-soft"
              }
            >
              ({count})
            </span>
          </Link>
        );
      })}
    </div>
  );
}
