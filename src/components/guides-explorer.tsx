"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { GuideCard } from "@/components/guide-card";
import { GuideSearch } from "@/components/guide-search";
import { trackTopicFilter } from "@/lib/analytics";
import { filterGuidesList } from "@/lib/guide-list";
import type { HomeGuide } from "@/components/home-guides-section";

export function GuidesExplorer({
  guides,
  categories,
}: {
  guides: HomeGuide[];
  categories: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic")?.trim() ?? "";
  const query = searchParams.get("q")?.trim() ?? "";

  const filtered = useMemo(
    () => filterGuidesList(guides, topic, query),
    [guides, topic, query],
  );

  const newestSlug = filtered[0]?.slug;
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

  function setTopic(next: string) {
    trackTopicFilter(next, "guides_index");
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
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((guide) => (
            <GuideCard
              key={guide.slug}
              guide={guide}
              badge={guide.slug === newestSlug ? "New" : undefined}
              placement="guides_index"
            />
          ))}
        </div>
      )}
    </>
  );
}
