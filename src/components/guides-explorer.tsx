"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { GuideCard } from "@/components/guide-card";
import { GuideSearch } from "@/components/guide-search";
import { NewsletterSignupCard } from "@/components/newsletter-signup-card";
import { trackTopicFilter } from "@/lib/analytics";
import { filterGuidesList } from "@/lib/guide-query";
import type { GuideListItem } from "@/lib/guide-model";
import { topicSlugForCategory } from "@/lib/guide-topics";

const PAGE_SIZE = 30;

function pageHref(pageNumber: number, query: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (pageNumber > 1) params.set("page", String(pageNumber));
  const search = params.toString();
  return search ? `/guides?${search}` : "/guides";
}

export function GuidesExplorer({
  guides,
  currentGuides,
  pastSeasonGuides,
  categories,
}: {
  guides: GuideListItem[];
  currentGuides: GuideListItem[];
  pastSeasonGuides: GuideListItem[];
  categories: string[];
  initialPage?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic")?.trim() ?? "";
  const query = searchParams.get("q")?.trim() ?? "";
  const hasFilters = Boolean(topic || query);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const guide of guides) {
      map.set(guide.category, (map.get(guide.category) ?? 0) + 1);
    }
    return map;
  }, [guides]);

  const filtered = useMemo(
    () => filterGuidesList(guides, topic, query),
    [guides, topic, query],
  );

  const browseCurrent = useMemo(
    () => filterGuidesList(currentGuides, topic, query),
    [currentGuides, topic, query],
  );
  const browsePast = useMemo(
    () => filterGuidesList(pastSeasonGuides, topic, query),
    [pastSeasonGuides, topic, query],
  );

  const useSeasonShelf = !hasFilters;
  const primaryPool = useSeasonShelf ? browseCurrent : filtered;
  const pastPool = useSeasonShelf ? browsePast : [];

  const totalPages = Math.max(1, Math.ceil(primaryPool.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageSlice = primaryPool.slice(pageStart, pageStart + PAGE_SIZE);
  const showHero = !hasFilters && safePage === 1 && pageSlice.length > 0;
  const hero = showHero ? pageSlice[0] : null;
  const gridGuides = showHero ? pageSlice.slice(1) : pageSlice;
  const showPastShelf = useSeasonShelf && safePage === 1 && pastPool.length > 0;

  const topics = [
    "",
    ...[
      ...new Set(
        categories.filter(
          (category) => Boolean(category?.trim()) && category.trim() !== "All",
        ),
      ),
    ],
  ];

  function clearFilters() {
    trackTopicFilter("", "guides_index_clear");
    router.push("/guides", { scroll: false });
  }

  const rangeStart = primaryPool.length ? pageStart + 1 : 0;
  const rangeEnd = Math.min(pageStart + PAGE_SIZE, primaryPool.length);
  const empty = primaryPool.length === 0 && pastPool.length === 0;

  return (
    <>
      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div
            className="flex flex-wrap gap-2 sm:gap-3"
            role="navigation"
            aria-label="Browse guides by topic"
          >
            {topics.map((value) => {
              const selected = value === topic || (!value && !topic);
              const count = value ? (counts.get(value) ?? 0) : guides.length;
              const label = value || "All";
              const topicSlug = value ? topicSlugForCategory(value) : null;
              const href = topicSlug ? `/guides/${topicSlug}` : "/guides";
              const className = selected
                ? "rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-sm ring-2 ring-ink ring-offset-2 ring-offset-paper sm:text-base"
                : "rounded-full border border-rule bg-paper px-4 py-2.5 text-sm font-medium text-ink transition hover:border-pine hover:text-pine sm:text-base";

              return (
                <Link
                  key={value || "all-topics"}
                  href={href}
                  aria-current={selected && !topicSlug ? "page" : undefined}
                  onClick={() => {
                    if (topicSlug) trackTopicFilter(value, "guides_index_pillar");
                    else trackTopicFilter("", "guides_index");
                  }}
                  className={className}
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
          {hasFilters || totalPages > 1 ? (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <p className="text-ink-soft">
                {primaryPool.length
                  ? `Showing ${rangeStart}-${rangeEnd} of ${primaryPool.length}`
                  : "No guides match"}
                {topic ? ` in ${topic}` : ""}
                {query ? ` for "${query}"` : ""}
              </p>
              {hasFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-semibold text-pine underline decoration-pine/30 underline-offset-2 hover:text-rust"
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="w-full shrink-0 lg:max-w-xs">
          <GuideSearch />
        </div>
      </div>

      {empty ? (
        <p className="mt-10 text-base text-ink-soft">
          Nothing matches that yet.{" "}
          <Link href="/guides" className="font-medium text-pine hover:text-rust">
            Show all guides
          </Link>
        </p>
      ) : (
        <div id="guides-list" className="mt-10 scroll-mt-24 space-y-8">
          {hero ? (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-pine">
                This week
              </p>
              <GuideCard
                guide={hero}
                badge="Now"
                placement="guides_index_hero"
                variant="hero"
              />
            </div>
          ) : null}

          {gridGuides.length > 0 ? (
            <div>
              {hero ? (
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                  Guides for right now
                </p>
              ) : null}
              <div className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
                {gridGuides.map((guide) => (
                  <GuideCard
                    key={guide.slug}
                    guide={guide}
                    placement="guides_index"
                  />
                ))}
              </div>
            </div>
          ) : null}

          {showPastShelf ? (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                Past season
              </p>
              <p className="mb-4 max-w-2xl text-sm leading-6 text-ink-soft">
                Halloween, fall-break, and other dated pieces stay here until next year.
                Same URLs. Fresh when the calendar comes back around.
              </p>
              <div className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
                {pastPool.map((guide) => (
                  <GuideCard
                    key={guide.slug}
                    guide={guide}
                    placement="guides_index_past_season"
                  />
                ))}
              </div>
            </div>
          ) : null}

          {totalPages > 1 ? (
            <nav
              className="flex flex-wrap items-center justify-center gap-2 pt-2"
              aria-label="Guide pages"
            >
              {safePage > 1 ? (
                <Link
                  href={pageHref(safePage - 1, query)}
                  className="rounded-full border border-rule px-3 py-1.5 text-sm font-medium text-ink transition hover:border-pine hover:text-pine"
                >
                  Previous
                </Link>
              ) : (
                <span className="rounded-full border border-rule px-3 py-1.5 text-sm font-medium text-ink opacity-40">
                  Previous
                </span>
              )}
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                const current = pageNumber === safePage;
                return (
                  <Link
                    key={pageNumber}
                    href={pageHref(pageNumber, query)}
                    aria-current={current ? "page" : undefined}
                    className={
                      current
                        ? "flex h-9 min-w-9 items-center justify-center rounded-full bg-ink px-3 text-sm font-semibold text-paper"
                        : "flex h-9 min-w-9 items-center justify-center rounded-full border border-rule px-3 text-sm font-medium text-ink transition hover:border-pine hover:text-pine"
                    }
                  >
                    {pageNumber}
                  </Link>
                );
              })}
              {safePage < totalPages ? (
                <Link
                  href={pageHref(safePage + 1, query)}
                  className="rounded-full border border-rule px-3 py-1.5 text-sm font-medium text-ink transition hover:border-pine hover:text-pine"
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-full border border-rule px-3 py-1.5 text-sm font-medium text-ink opacity-40">
                  Next
                </span>
              )}
            </nav>
          ) : null}

          <GuidesStayInformedSignup />
        </div>
      )}
    </>
  );
}

function GuidesStayInformedSignup() {
  return (
    <NewsletterSignupCard
      kicker="New guides"
      title="Sign up to stay informed"
      body="One email on Sunday when a new guide drops, plus the free grocery checklist to start the week."
      source="guides_index"
    />
  );
}
