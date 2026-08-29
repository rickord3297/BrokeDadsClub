"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GuideCard } from "@/components/guide-card";
import { InlineEmailBar } from "@/components/inline-email-bar";
import { trackTopicFilter } from "@/lib/analytics";
import { filterGuidesList } from "@/lib/guide-query";
import type { GuideListItem } from "@/lib/guide-model";

const FEATURED_SLUG = "the-dad-tax";
const GRID_LIMIT = 6;

export function HomeGuidesSection({
  guides,
  categories,
}: {
  guides: GuideListItem[];
  categories: string[];
}) {
  const [topic, setTopic] = useState("");

  const featured = useMemo(
    () => guides.find((guide) => guide.slug === FEATURED_SLUG) ?? guides[0],
    [guides],
  );

  const filtered = useMemo(
    () => filterGuidesList(guides, topic),
    [guides, topic],
  );

  const gridGuides = useMemo(() => {
    const withoutFeatured = filtered.filter(
      (guide) => guide.slug !== featured?.slug,
    );
    return withoutFeatured.slice(0, GRID_LIMIT);
  }, [filtered, featured?.slug]);

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

  function selectTopic(next: string) {
    const value = next === topic ? "" : next;
    trackTopicFilter(value, "homepage");
    setTopic(value);
  }

  return (
    <div
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

        {featured ? (
          <div className="mt-6">
            <GuideCard
              guide={featured}
              badge="Featured"
              placement="homepage_featured"
              variant="hero"
            />
          </div>
        ) : null}

        <InlineEmailBar
          source="homepage-inline"
          successHref="/resources/grocery-week-checklist"
          successLinkLabel="Open the full grocery checklist"
          embedded
        />

        {topics.length > 1 ? (
          <div className="mt-8">
            <div
              className="inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-rule bg-paper p-1"
              role="group"
              aria-label="Filter guides by topic"
            >
              {topics.map((value) => {
                const selected = value === topic;
                const label = value || "All";
                return (
                  <button
                    key={value || "all-topics"}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => selectTopic(value)}
                    className={
                      selected
                        ? "rounded-md bg-pine px-4 py-2 text-sm font-medium text-paper"
                        : "rounded-md px-4 py-2 text-sm font-medium text-ink-soft transition hover:bg-paper-2 hover:text-ink"
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {topic ? (
              <p className="mt-2 text-sm text-ink-soft">
                Showing {gridGuides.length} guide{gridGuides.length === 1 ? "" : "s"} in {topic}
              </p>
            ) : null}
          </div>
        ) : null}

        {gridGuides.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gridGuides.map((guide) => (
              <GuideCard
                key={guide.slug}
                guide={guide}
                placement="homepage_grid"
              />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-ink-soft">
            No guides in that category yet.{" "}
            <button
              type="button"
              onClick={() => setTopic("")}
              className="font-medium text-pine hover:text-rust"
            >
              Show all
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
