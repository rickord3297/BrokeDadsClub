"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GuideCard } from "@/components/guide-card";
import { filterGuidesList, splitLatestGuide } from "@/lib/guide-list";

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
  const { latest, rest } = useMemo(() => splitLatestGuide(filtered), [filtered]);

  const pillClass = "px-4 py-2.5 text-sm sm:text-base";

  return (
    <section id="guides" className="scroll-mt-20 border-t border-rule">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-rust">Guides</p>
            <h2 className="mt-2 font-display text-4xl">
              {topic ? `${topic} guides` : "Guides"}
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">
              {topic
                ? `${filtered.length} guide${filtered.length === 1 ? "" : "s"} on ${topic.toLowerCase()}.`
                : "Tactics you can use this week. Filter by topic or read the newest first."}
            </p>
          </div>
          <Link
            href={topic ? `/guides?topic=${encodeURIComponent(topic)}` : "/guides"}
            className="text-sm font-medium text-pine hover:text-rust"
          >
            All guides →
          </Link>
        </div>

        {latest ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <GuideCard guide={latest} badge="New" />
          </div>
        ) : null}

        {categories.length > 0 ? (
          <div className="mt-8 rounded-2xl border border-rule bg-paper-2/50 px-4 py-5 sm:px-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
              Browse by topic
            </p>
            <div
              className="mt-4 flex flex-wrap gap-2 sm:gap-3"
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
            {rest.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
