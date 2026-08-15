import Link from "next/link";

function guidesHref(topic: string, query = "") {
  const params = new URLSearchParams();
  if (topic) params.set("topic", topic);
  if (query.trim()) params.set("q", query.trim());
  const search = params.toString();
  return search ? `/guides?${search}` : "/guides";
}

export function TopicPills({
  categories,
  active = "",
  query = "",
}: {
  categories: string[];
  active?: string;
  query?: string;
}) {
  if (!categories.length) return null;

  const pills = ["", ...categories];

  return (
    <div className="flex flex-wrap gap-2" role="navigation" aria-label="Guide topics">
      {pills.map((topic) => {
        const selected = topic === active;
        return (
          <Link
            key={topic || "all"}
            href={guidesHref(topic, query)}
            scroll={false}
            className={
              selected
                ? "rounded-full bg-pine px-3 py-1.5 text-sm font-semibold text-paper"
                : "rounded-full border border-rule bg-paper px-3 py-1.5 text-sm font-medium text-ink hover:border-pine hover:text-pine"
            }
          >
            {topic || "All"}
          </Link>
        );
      })}
    </div>
  );
}
