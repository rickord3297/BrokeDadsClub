"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GuideCard } from "@/components/guide-card";

export type HomeGuide = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
};

function guideBadge(slug: string, startHereSlugs: string[]) {
  if (slug === "the-dad-tax") return "Most popular";
  if (slug === "the-second-bill") return "New";
  if (startHereSlugs.includes(slug)) return "Start here";
  return undefined;
}

export function HomeGuidesSection({
  guides,
  categories,
  startHereSlugs,
}: {
  guides: HomeGuide[];
  categories: string[];
  startHereSlugs: string[];
}) {
  const [topic, setTopic] = useState("");

  const visible = useMemo(() => {
    if (!topic) {
      return startHereSlugs
        .map((slug) => guides.find((guide) => guide.slug === slug))
        .filter((guide): guide is HomeGuide => guide != null);
    }
    return guides.filter((guide) => guide.category === topic);
  }, [guides, startHereSlugs, topic]);

  const pillClass = "px-4 py-2.5 text-sm sm:text-base";

  return (
    <section id="guides" className="border-t border-rule scroll-mt-20">
      {categories.length > 0 ? (
        <div className="border-b border-rule bg-paper-2/50">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-7">
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
        </div>
      ) : null}

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-rust">Guides</p>
            <h2 className="mt-2 font-display text-4xl">
              {topic ? `${topic} guides` : "Start here"}
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">
              {topic
                ? `${visible.length} guide${visible.length === 1 ? "" : "s"} on ${topic.toLowerCase()}.`
                : "Why everything costs more, the August supply trap, and the fees that hit after school starts."}
            </p>
          </div>
          <Link
            href={topic ? `/guides?topic=${encodeURIComponent(topic)}` : "/guides"}
            className="text-sm font-medium text-pine hover:text-rust"
          >
            All guides →
          </Link>
        </div>

        {visible.length === 0 ? (
          <p className="mt-8 text-base text-ink-soft">
            Nothing in this topic yet.{" "}
            <button
              type="button"
              onClick={() => setTopic("")}
              className="font-medium text-pine hover:text-rust"
            >
              Show Start here
            </button>
          </p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((guide) => (
              <GuideCard
                key={guide.slug}
                guide={guide}
                badge={topic ? undefined : guideBadge(guide.slug, startHereSlugs)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
