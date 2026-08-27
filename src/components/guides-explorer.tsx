"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, type ReactNode } from "react";
import { GuideCard } from "@/components/guide-card";
import { GuideSearch } from "@/components/guide-search";
import {
  GuidesBundleJumpLinks,
  GuidesCuratedBundles,
} from "@/components/guides-curated-bundles";
import { GuidesInlineSignup } from "@/components/guides-inline-signup";
import { trackTopicFilter } from "@/lib/analytics";
import { GUIDE_BUNDLES } from "@/lib/guide-bundles";
import { categoryCounts } from "@/lib/guide-display";
import { filterGuidesList, splitLatestGuide, type GuideListItem } from "@/lib/guide-list";

const SIGNUP_EVERY = 6;

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
  const browsing = Boolean(topic || query);

  const searchScoped = useMemo(
    () => filterGuidesList(guides, "", query),
    [guides, query],
  );

  const counts = useMemo(() => categoryCounts(searchScoped), [searchScoped]);
  const totalMatching = searchScoped.length;

  const filtered = useMemo(
    () => filterGuidesList(guides, topic, query),
    [guides, topic, query],
  );

  const { latest, rest } = splitLatestGuide(filtered);
  const showHero = Boolean(latest);
  const showCurated = !browsing;

  const pillClass = "px-4 py-2.5 text-sm sm:text-base";
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
    trackTopicFilter(next, "guides_index");
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("topic", next);
    else params.delete("topic");
    pushParams(params);
  }

  function clearFilters() {
    router.push("/guides", { scroll: false });
  }

  function pillLabel(value: string) {
    if (!value) return `All (${totalMatching})`;
    const count = counts[value] ?? 0;
    return `${value} (${count})`;
  }

  const gridItems: ReactNode[] = [];
  let cardIndex = 0;

  for (const guide of rest) {
    if (cardIndex > 0 && cardIndex % SIGNUP_EVERY === 0) {
      gridItems.push(
        <div key={`signup-${cardIndex}`} className="md:col-span-2 lg:col-span-3">
          <GuidesInlineSignup />
        </div>,
      );
    }

    gridItems.push(
      <GuideCard
        key={guide.slug}
        guide={guide}
        placement="guides_index"
      />,
    );
    cardIndex += 1;
  }

  return (
    <>
      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-3">
          <div
            className="flex flex-wrap gap-2 sm:gap-2.5"
            role="group"
            aria-label="Filter guides by topic"
          >
            {topics.map((value) => {
              const selected = value === topic;
              return (
                <button
                  key={value || "all-topics"}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setTopic(value)}
                  className={
                    selected
                      ? `rounded-full bg-pine font-semibold text-paper shadow-md shadow-pine/25 ring-2 ring-pine ring-offset-2 ring-offset-paper ${pillClass}`
                      : `rounded-full border border-rule bg-paper font-medium text-ink transition hover:border-pine hover:text-pine ${pillClass}`
                  }
                >
                  {pillLabel(value)}
                </button>
              );
            })}
          </div>
          {browsing ? (
            <button
              type="button"
              onClick={clearFilters}
              className="self-start text-sm font-medium text-rust underline decoration-rust/30 underline-offset-2 hover:text-rust-2"
            >
              Clear filters
            </button>
          ) : null}
        </div>
        <GuideSearch />
      </div>

      {showCurated ? (
        <>
          <GuidesBundleJumpLinks bundles={GUIDE_BUNDLES} />
          <GuidesCuratedBundles bundles={GUIDE_BUNDLES} allGuides={guides} />
          <div className="mt-14 border-t border-rule pt-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-rust">
              Full library
            </p>
            <h2 className="mt-2 font-display text-3xl">All guides</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
              Newest first. Filter by topic or search when you know what you need.
            </p>
          </div>
        </>
      ) : null}

      {filtered.length === 0 ? (
        <p className="mt-10 text-base text-ink-soft">
          Nothing matches that yet.{" "}
          <Link
            href="/guides"
            onClick={(event) => {
              event.preventDefault();
              clearFilters();
            }}
            className="font-medium text-pine hover:text-rust"
          >
            Show all guides
          </Link>
        </p>
      ) : (
        <div className={`grid gap-5 md:grid-cols-2 lg:grid-cols-3 ${showCurated ? "mt-8" : "mt-10"}`}>
          {showHero && latest ? (
            <div className="md:col-span-2 lg:col-span-3">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-pine">
                {browsing ? "Top match" : "Latest guide"}
              </p>
              <GuideCard
                guide={latest}
                badge={browsing ? undefined : "New"}
                placement="guides_index_hero"
                variant="hero"
              />
            </div>
          ) : null}
          {gridItems}
        </div>
      )}
    </>
  );
}
