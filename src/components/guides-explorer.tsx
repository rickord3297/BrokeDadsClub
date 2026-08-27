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

const NEWSLETTER_AFTER_INDEX = 2;

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

  const showHero = !hasFilters;
  const hero = showHero ? filtered[0] : null;
  const list = hero
    ? filtered.filter((guide) => guide.slug !== hero.slug)
    : filtered;

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

  function setTopic(next: string) {
    const value = next === topic ? "" : next;
    trackTopicFilter(value, "guides_index");
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("topic", value);
    else params.delete("topic");
    const search = params.toString();
    router.push(search ? `/guides?${search}` : "/guides", { scroll: false });
  }

  function clearFilters() {
    trackTopicFilter("", "guides_index_clear");
    router.push("/guides", { scroll: false });
  }

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
          {hasFilters ? (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <p className="text-ink-soft">
                Showing {filtered.length} of {guides.length}
                {topic ? ` in ${topic}` : ""}
                {query ? ` for "${query}"` : ""}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="font-semibold text-pine underline decoration-pine/30 underline-offset-2 hover:text-rust"
              >
                Clear filters
              </button>
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
        <div className="mt-10 space-y-8">
          {hero ? (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-pine">
                Newest
              </p>
              <GuideCard
                guide={hero}
                badge="New"
                placement="guides_index_hero"
                variant="hero"
              />
            </div>
          ) : null}

          {list.length > 0 ? (
            <div>
              {hero ? (
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                  All guides
                </p>
              ) : null}
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {list.flatMap((guide, index) => {
                  const card = (
                    <GuideCard
                      key={guide.slug}
                      guide={guide}
                      placement="guides_index"
                    />
                  );
                  if (index !== NEWSLETTER_AFTER_INDEX) return [card];
                  return [
                    card,
                    <div
                      key="guides-inline-signup"
                      className="md:col-span-2 lg:col-span-3"
                    >
                      <GuidesInlineSignup />
                    </div>,
                  ];
                })}
              </div>
              {list.length <= NEWSLETTER_AFTER_INDEX ? (
                <div className="mt-5">
                  <GuidesInlineSignup />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}

function GuidesInlineSignup() {
  return (
    <aside className="rounded-2xl border border-rust/25 bg-rust/[0.06] px-5 py-6 sm:px-7">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pine">
            New guide alert
          </p>
          <h3 className="mt-1 font-display text-2xl leading-snug">
            Get the next one on Sunday
          </h3>
          <p className="mt-1 text-sm leading-6 text-ink-soft">
            One short dad tactic a week. No daily spam pile.
          </p>
        </div>
        <div className="w-full sm:max-w-sm">
          <NewsletterForm
            variant="inline"
            source="guides_index_inline"
            submitLabel={site.weekStart.button}
            successMessage={site.weekStart.success}
            successHref="/resources/grocery-week-checklist"
            successLinkLabel="Print the grocery checklist"
          />
        </div>
      </div>
    </aside>
  );
}
