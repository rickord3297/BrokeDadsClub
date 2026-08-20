import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { GuideCard } from "@/components/guide-card";
import { GuideSearch } from "@/components/guide-search";
import { TopicPills } from "@/components/topic-pills";
import {
  START_HERE_SLUGS,
  getGuide,
  getGuideCategories,
  getGuides,
  matchesGuideQuery,
} from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Practical dad guides on money, time, kids, and gear, written for fathers stretching every dollar.",
};

const startHereSlugs = START_HERE_SLUGS;

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; q?: string }>;
}) {
  const params = await searchParams;
  const topic = params.topic?.trim() ?? "";
  const query = params.q?.trim() ?? "";
  const guides = getGuides();
  const categories = getGuideCategories(guides);
  const filtered = guides.filter((guide) => {
    const topicOk = !topic || guide.category === topic;
    return topicOk && matchesGuideQuery(guide, query);
  });
  const browsing = Boolean(topic || query);
  const startHere = startHereSlugs
    .map((slug) => getGuide(slug))
    .filter((guide): guide is NonNullable<typeof guide> => guide != null);
  const rest = filtered.filter((guide) => !startHereSlugs.includes(guide.slug));

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Guides</p>
      <h1 className="mt-3 font-display text-5xl">Guides for dads</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        Not a lifestyle magazine. Tactics you can use this week: groceries,
        school fees, talking about money, and work that doesn&apos;t steal bedtime.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TopicPills categories={categories} active={topic} query={query} />
        <Suspense
          fallback={
            <div className="h-11 w-full max-w-md rounded-full border border-rule bg-paper" />
          }
        >
          <GuideSearch />
        </Suspense>
      </div>

      {!browsing && startHere.length > 0 ? (
        <section className="mt-12">
          <p className="text-xs uppercase tracking-[0.18em] text-rust">Start here</p>
          <h2 className="mt-2 font-display text-3xl">Three that pay rent</h2>
          <p className="mt-2 max-w-2xl text-base leading-7 text-ink-soft">
            Read these first: why everything costs more, the August supply trap,
            and the fees that land after school starts.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {startHere.map((guide) => (
              <GuideCard
                key={guide.slug}
                guide={guide}
                badge={
                  guide.slug === "the-dad-tax"
                    ? "Most popular"
                    : guide.slug === "the-second-bill"
                      ? "New"
                      : "Start here"
                }
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-14">
        <h2 className="font-display text-3xl">
          {browsing ? "Matching guides" : "More guides"}
        </h2>
        {filtered.length === 0 ? (
          <p className="mt-6 text-base text-ink-soft">
            Nothing matches that yet.{" "}
            <Link href="/guides" className="font-medium text-pine hover:text-rust">
              Show all guides
            </Link>
          </p>
        ) : browsing ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filtered.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {rest.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
