import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import type { GuideListItem } from "@/lib/guide-model";
import { GUIDE_PILLARS } from "@/lib/guide-pillars";
import { START_HERE_SLUGS } from "@/lib/guides";

const LATEST_COUNT = 10;

export function HomeGuidesSection({
  guides,
  chronological,
}: {
  guides: GuideListItem[];
  /** Newest-first for the Latest list (not seasonal browse rank). */
  chronological: GuideListItem[];
}) {
  const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));
  const featured = START_HERE_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (guide): guide is GuideListItem => Boolean(guide),
  );
  const featuredSlugs = new Set(featured.map((guide) => guide.slug));
  const latest = chronological
    .filter((guide) => !featuredSlugs.has(guide.slug))
    .slice(0, LATEST_COUNT);

  const topics = GUIDE_PILLARS.filter((pillar) =>
    guides.some((guide) => guide.category === pillar.category),
  );

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

        {topics.length > 0 ? (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Browse by topic
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {topics.map((topic) => (
                <li key={topic.slug}>
                  <Link
                    href={`/guides/${topic.slug}`}
                    className="inline-flex rounded-full border border-rule bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-pine hover:text-pine"
                  >
                    {topic.category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {featured.length > 0 ? (
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Start here
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((guide) => (
                <GuideCard
                  key={guide.slug}
                  guide={guide}
                  placement="homepage_start_here"
                />
              ))}
            </div>
          </div>
        ) : null}

        {latest.length > 0 ? (
          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Latest guides
            </p>
            <ol className="mt-4 grid gap-2 sm:grid-cols-2">
              {latest.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="block rounded-xl border border-rule/80 bg-paper px-4 py-3 transition hover:border-pine"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rust">
                      {guide.category}
                    </span>
                    <span className="mt-1 block font-medium text-ink hover:text-pine">
                      {guide.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </section>
  );
}
