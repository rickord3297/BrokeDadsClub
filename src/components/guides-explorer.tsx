"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { GuideCard } from "@/components/guide-card";
import { GuideSearch } from "@/components/guide-search";
import { NewsletterForm } from "@/components/newsletter-form";
import { trackTopicFilter } from "@/lib/analytics";
import { filterGuidesList } from "@/lib/guide-query";
import type { GuideListItem } from "@/lib/guide-model";
import { site } from "@/lib/site";

const PAGE_SIZE = 9;

export function GuidesExplorer({
  guides,
  categories,
}: {
  guides: GuideListItem[];
  categories: string[];
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageSlice = filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const showHero = !hasFilters && safePage === 1 && pageSlice.length > 0;
  const hero = showHero ? pageSlice[0] : null;
  const gridGuides = showHero ? pageSlice.slice(1) : pageSlice;

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

  function pushParams(next: URLSearchParams) {
    const search = next.toString();
    router.push(search ? `/guides?${search}` : "/guides", { scroll: false });
  }

  function setTopic(next: string) {
    const value = next === topic ? "" : next;
    trackTopicFilter(value, "guides_index");
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("topic", value);
    else params.delete("topic");
    params.delete("page");
    pushParams(params);
  }

  function clearFilters() {
    trackTopicFilter("", "guides_index_clear");
    router.push("/guides", { scroll: false });
  }

  function setPage(next: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (next <= 1) params.delete("page");
    else params.set("page", String(next));
    pushParams(params);
    document.getElementById("guides-list")?.scrollIntoView({ behavior: "smooth" });
  }

  const rangeStart = filtered.length ? pageStart + 1 : 0;
  const rangeEnd = Math.min(pageStart + PAGE_SIZE, filtered.length);

  return (
    <>
      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div
            className="flex flex-wrap gap-2 sm:gap-3"
            role="group"
            aria-label="Filter guides by topic"
          >
            {topics.map((value) => {
              const selected = value === topic;
              const count = value ? (counts.get(value) ?? 0) : guides.length;
              const label = value || "All";
              return (
                <button
                  key={value || "all-topics"}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setTopic(value)}
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
                </button>
              );
            })}
          </div>
          {hasFilters || totalPages > 1 ? (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <p className="text-ink-soft">
                {filtered.length
                  ? `Showing ${rangeStart}–${rangeEnd} of ${filtered.length}`
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

      {filtered.length === 0 ? (
        <p className="mt-10 text-base text-ink-soft">
          Nothing matches that yet.{" "}
          <button
            type="button"
            onClick={clearFilters}
            className="font-medium text-pine hover:text-rust"
          >
            Show all guides
          </button>
        </p>
      ) : (
        <div id="guides-list" className="mt-10 scroll-mt-24 space-y-8">
          {hero ? (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-pine">
                Latest
              </p>
              <GuideCard
                guide={hero}
                badge="New"
                placement="guides_index_hero"
                variant="hero"
              />
            </div>
          ) : null}

          {gridGuides.length > 0 ? (
            <div>
              {hero ? (
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                  All guides
                </p>
              ) : null}
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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

          {totalPages > 1 ? (
            <nav
              className="flex flex-wrap items-center justify-center gap-2 pt-2"
              aria-label="Guide pages"
            >
              <button
                type="button"
                onClick={() => setPage(safePage - 1)}
                disabled={safePage <= 1}
                className="rounded-full border border-rule px-3 py-1.5 text-sm font-medium text-ink transition hover:border-pine hover:text-pine disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                const current = pageNumber === safePage;
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    aria-current={current ? "page" : undefined}
                    onClick={() => setPage(pageNumber)}
                    className={
                      current
                        ? "flex h-9 min-w-9 items-center justify-center rounded-full bg-ink px-3 text-sm font-semibold text-paper"
                        : "flex h-9 min-w-9 items-center justify-center rounded-full border border-rule px-3 text-sm font-medium text-ink transition hover:border-pine hover:text-pine"
                    }
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setPage(safePage + 1)}
                disabled={safePage >= totalPages}
                className="rounded-full border border-rule px-3 py-1.5 text-sm font-medium text-ink transition hover:border-pine hover:text-pine disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
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
    <aside className="rounded-2xl border border-pine/20 border-l-[3px] border-l-pine bg-pine/[0.06] px-5 py-6 sm:px-7">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pine">
            New guides
          </p>
          <h3 className="mt-1 font-display text-2xl leading-snug">
            Sign up to stay informed
          </h3>
          <p className="mt-1 text-sm leading-6 text-ink-soft">
            One email on Sunday when a new guide drops, plus the free grocery
            checklist to start the week.
          </p>
        </div>
        <div className="w-full sm:max-w-sm">
          <NewsletterForm
            variant="inline"
            source="guides_index"
            submitLabel="Keep me posted"
            successMessage={site.weekStart.success}
            successHref="/resources/grocery-week-checklist"
            successLinkLabel="Print the grocery checklist"
          />
        </div>
      </div>
    </aside>
  );
}
