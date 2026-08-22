"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GuideCard } from "@/components/guide-card";
import { filterGuidesList } from "@/lib/guide-list";

export type HomeGuide = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
};

export function HomeGuidesSection({
  guides,
  categories,
}: {
  guides: HomeGuide[];
  categories: string[];
}) {
  const [topic, setTopic] = useState("");

  const filtered = useMemo(
    () => filterGuidesList(guides, topic),
    [guides, topic],
  );

  const newestSlug = filtered[0]?.slug;
  const pillClass = "px-4 py-2.5 text-sm sm:text-base";

  return (
    <section id="guides" className="scroll-mt-20 border-t border-rule">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-rust">
            Guides
          </h2>
          <Link
            href={topic ? `/guides?topic=${encodeURIComponent(topic)}` : "/guides"}
            className="text-sm font-medium text-pine hover:text-rust"
          >
            All guides →
          </Link>
        </div>

        {categories.length > 0 ? (
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
              Browse by topic
            </p>
            <div
              className="mt-3 flex flex-wrap gap-2 sm:gap-3"
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
          </div>
        ) : null}

        {filtered.length === 0 ? (
          <p className="mt-8 text-base text-ink-soft">
            Nothing in this topic yet.{" "}
            <button
              type="button"
              onClick={() => setTopic("")}
              className="font-medium text-pine hover:text-rust"
            >
              Show all guides
            </button>
          </p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((guide) => (
              <GuideCard
                key={guide.slug}
                guide={guide}
                badge={guide.slug === newestSlug ? "New" : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
