import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import type { GuideListItem } from "@/lib/guide-model";
import { START_HERE_SLUGS } from "@/lib/guides";

const LATEST_COUNT = 6;

export function HomeGuidesSection({ guides }: { guides: GuideListItem[] }) {
  const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  const featured = START_HERE_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (guide): guide is GuideListItem => Boolean(guide),
  );
  const featuredSlugs = new Set(featured.map((guide) => guide.slug));
  const latest = guides
    .filter((guide) => !featuredSlugs.has(guide.slug))
    .slice(0, Math.max(0, LATEST_COUNT - featured.length));
  const shown = [...featured, ...latest].slice(0, LATEST_COUNT);

  return (
    <section
      id="start-here"
      className="scroll-mt-20 border-t border-pine/15 bg-pine/[0.04]"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-3xl text-pine sm:text-[2rem]">
            The Guides
          </h2>
          <Link
            href="/guides"
            className="shrink-0 text-sm font-medium text-pine underline decoration-pine/30 underline-offset-4 transition hover:text-rust hover:decoration-rust/40"
          >
            All guides →
          </Link>
        </div>

        {shown.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((guide) => (
              <GuideCard
                key={guide.slug}
                guide={guide}
                placement="homepage_grid"
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
