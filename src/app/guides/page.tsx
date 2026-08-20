import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { GuideCard } from "@/components/guide-card";
import { GuideSearch } from "@/components/guide-search";
import { TopicPills } from "@/components/topic-pills";
import { getGuideCategories, getGuides, matchesGuideQuery } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Practical dad guides on money, time, kids, and gear, written for fathers stretching every dollar.",
};

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
  const latest = filtered[0] ?? null;
  const rest = latest ? filtered.filter((guide) => guide.slug !== latest.slug) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Guides</p>
      <h1 className="mt-3 font-display text-5xl">Guides for dads</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        Not a lifestyle magazine. Tactics you can use this week: groceries,
        school fees, talking about money, and work that doesn&apos;t steal bedtime.
      </p>

      {latest ? (
        <div className="mt-10 max-w-xl">
          <GuideCard guide={latest} badge="New" />
        </div>
      ) : null}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TopicPills categories={categories} active={topic} query={query} />
        <Suspense
          fallback={
            <div className="h-11 w-full max-w-md rounded-full border border-rule bg-paper" />
          }
        >
          <GuideSearch />
        </Suspense>
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
          {rest.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      )}
    </div>
  );
}
