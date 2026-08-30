import {
  formatWeeklyReaderSignal,
  weeklyReaderCount,
} from "@/lib/guide-reader-signal";

export function GuideReaderSignal({
  slug,
  publishedAt,
}: {
  slug: string;
  publishedAt: string;
}) {
  const count = weeklyReaderCount(slug, publishedAt);

  return (
    <p className="mt-1 text-xs font-medium text-ink-soft">
      {formatWeeklyReaderSignal(count)}
    </p>
  );
}
