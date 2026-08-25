"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { GuideCard } from "@/components/guide-card";
import { GuideSearch } from "@/components/guide-search";
import { filterGuidesList } from "@/lib/guide-list";
import type { HomeGuide } from "@/components/home-guides-section";

const PROMOTED_BADGES: Record<string, string> = {
  "school-clothes-for-two-kids": "Back-to-school pick",
  "the-sports-fee-not-on-the-form": "Fall sports pick",
};

export function GuidesExplorer({
  guides,
  categories,
  promotedSlugs = [],
}: {
  guides: HomeGuide[];
  categories: string[];
  promotedSlugs?: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic")?.trim() ?? "";
  const query = searchParams.get("q")?.trim() ?? "";

  const filtered = useMemo(
    () => filterGuidesList(guides, topic, query),
    [guides, topic, query],
  );

  const browsing = Boolean(topic || query);
  const promoted = useMemo(
    () =>
      promotedSlugs
        .map((slug) => guides.find((guide) => guide.slug === slug))
        .filter((guide): guide is HomeGuide => guide != null),
    [guides, promotedSlugs],
  );
  const promotedSet = useMemo(() => new Set(promotedSlugs), [promotedSlugs]);
  const rest = useMemo(
    () => filtered.filter((guide) => !promotedSet.has(guide.slug)),
    [filtered, promotedSet],
  );
  const newestSlug = rest[0]?.slug;
  const pillClass = "px-4 py-2.5 text-sm sm:text-base";

  function setTopic(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("topic", next);
    else params.delete("topic");
    const search = params.toString();
    router.push(search ? `/guides?${search}` : "/guides", { scroll: false });
  }

  return (
    <>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex flex-wrap gap-2 sm:gap-3"
          role="group"
          aria-label="Filter guides by topic"
        >
          {["", ...categories].map((value) => {
            const selected = value === topic;
            return (
              <button
                key={value || "all"}
                type="button"
                aria-pressed={selected}
                onClick={() => setTopic(value)}
                className={
                  selected
                    ? `rounded-full bg-pine font-semibold text-paper ${pillClass}`
                    : `rounded-full border border-rule bg-paper font-medium text-ink hover:border-pine hover:text-pine ${pillClass}`
                }
              >
                {value || "All"}
              </button>
            );
          })}
        </div>
        <GuideSearch />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-base text-ink-soft">
          Nothing matches that yet.{" "}
          <Link href="/guides" className="font-medium text-pine hover:text-rust">
            Show all guides
          </Link>
        </p>
      ) : (
        <>
          {!browsing && promoted.length > 0 ? (
            <section className="mt-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-rust">
                Right now
              </p>
              <p className="mt-2 font-display text-2xl">Trending this week</p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {promoted.map((guide) => (
                  <GuideCard
                    key={guide.slug}
                    guide={guide}
                    badge={PROMOTED_BADGES[guide.slug] ?? "Trending"}
                  />
                ))}
              </div>
            </section>
          ) : null}
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {(browsing ? filtered : rest).map((guide) => (
              <GuideCard
                key={guide.slug}
                guide={guide}
                badge={guide.slug === newestSlug ? "New" : undefined}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
