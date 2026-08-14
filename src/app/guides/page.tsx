import type { Metadata } from "next";
import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import { getGuide, getGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Practical dad guides on money, time, kids, and gear, written for fathers stretching every dollar.",
};

const startHereSlugs = [
  "the-dad-tax",
  "the-47-dollar-grocery-week",
  "talking-to-kids-about-money",
];

export default function GuidesPage() {
  const guides = getGuides();
  const startHere = startHereSlugs
    .map((slug) => getGuide(slug))
    .filter((guide): guide is NonNullable<typeof guide> => guide != null);
  const rest = guides.filter((guide) => !startHereSlugs.includes(guide.slug));

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">The desk</p>
      <h1 className="mt-3 font-display text-5xl">Guides for dads</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        Not a lifestyle magazine. Tactics you can use this week: groceries,
        talking about money, cheap dates, and work that doesn&apos;t steal bedtime.
      </p>

      {startHere.length > 0 ? (
        <section className="mt-12">
          <p className="text-xs uppercase tracking-[0.18em] text-rust">Start here</p>
          <h2 className="mt-2 font-display text-3xl">Three that pay rent</h2>
          <p className="mt-2 max-w-2xl text-base leading-7 text-ink-soft">
            Read these first: why everything costs more, how to feed the week,
            and how to talk about money without scaring the kids.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {startHere.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl">All guides</h2>
          <Link
            href="/resources/grocery-week-checklist"
            className="text-sm font-medium text-pine hover:text-rust"
          >
            Free grocery checklist →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {rest.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </section>
    </div>
  );
}
