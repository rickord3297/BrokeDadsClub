import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import { InlineEmailBar } from "@/components/inline-email-bar";
import { ResourceCard } from "@/components/resource-card";
import { TopicPills } from "@/components/topic-pills";
import {
  PROMOTED_GUIDE_SLUGS,
  START_HERE_SLUGS,
  getGuide,
  getGuideCategories,
  getGuides,
  getPromotedGuides,
} from "@/lib/guides";
import { getResource } from "@/lib/resources";
import { site } from "@/lib/site";

const FEATURED_PRINTABLE = "grocery-week-checklist";

export default async function Home() {
  const guides = getGuides();
  const categories = getGuideCategories(guides);
  const startHere = START_HERE_SLUGS.map((slug) => getGuide(slug)).filter(
    (guide): guide is NonNullable<typeof guide> => guide != null,
  );
  const promoted = getPromotedGuides();
  const featuredPrintable = getResource(FEATURED_PRINTABLE);
  const promotedBadges: Record<(typeof PROMOTED_GUIDE_SLUGS)[number], string> = {
    "school-clothes-for-two-kids": "Back-to-school pick",
    "the-sports-fee-not-on-the-form": "Fall sports pick",
  };

  return (
    <div>
      <section className="border-b border-rule">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-pine">
            A place for the stretched-thin dads doing their best
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
            Raising kids.
            <br />
            Stretching dollars.
            <br />
            Still showing up.
          </h1>
          <p className="mt-5 inline-flex items-center rounded-full border border-pine/30 bg-pine/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-pine">
            No email wall · 100% free
          </p>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">
            Practical guides for dads doing the math out loud.
          </p>
          <p className="mt-4 font-display text-2xl text-rust sm:text-3xl">
            {site.tagline}
          </p>
          <div className="mt-8 max-w-xl rounded-2xl border border-rule bg-paper-2/60 px-5 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
              New here?
            </p>
            <p className="mt-2 font-display text-2xl leading-snug">
              Start with the 4 most essential dad guides
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              Why everything costs more, how to feed the week, the school list,
              and talking to kids about money.
            </p>
            <Link
              href="#start-here"
              className="mt-4 inline-flex h-11 items-center rounded-full bg-pine px-5 text-sm font-semibold text-paper hover:bg-pine-2"
            >
              Show me where to start
            </Link>
          </div>
        </div>
      </section>

      {promoted.length > 0 ? (
        <section id="right-now" className="scroll-mt-20 border-t border-rule bg-paper-2/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-rust">
                  Right now
                </h2>
                <p className="mt-2 font-display text-3xl">What dads are searching for</p>
                <p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">
                  Two guides picked from this week&apos;s trend scan: school clothes
                  and the sports bill nobody puts on the form.
                </p>
              </div>
              <Link
                href="/guides"
                className="text-sm font-medium text-pine hover:text-rust"
              >
                All guides →
              </Link>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {promoted.map((guide) => (
                <GuideCard
                  key={guide.slug}
                  guide={guide}
                  badge={
                    promotedBadges[guide.slug as (typeof PROMOTED_GUIDE_SLUGS)[number]]
                  }
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section
        id="start-here"
        className="scroll-mt-20 border-t border-rule"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-rust">
                Guides
              </h2>
              <p className="mt-2 font-display text-3xl">Start here</p>
              <p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">
                Four that pay rent. Everything else lives on the guides page.
              </p>
            </div>
            <Link
              href="/guides"
              className="text-sm font-medium text-pine hover:text-rust"
            >
              All guides →
            </Link>
          </div>

          {categories.length > 0 ? (
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
                Browse by topic
              </p>
              <div className="mt-3">
                <TopicPills categories={categories} size="lg" />
              </div>
            </div>
          ) : null}

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {startHere.map((guide) => (
              <GuideCard
                key={guide.slug}
                guide={guide}
                badge={
                  guide.slug === "the-dad-tax" ? "Most popular" : "Start here"
                }
              />
            ))}
          </div>
        </div>
      </section>

      <InlineEmailBar
        source="homepage-inline"
        successHref="/resources/grocery-week-checklist"
        successLinkLabel="Print the grocery checklist"
      />

      {featuredPrintable ? (
        <section id="printables" className="scroll-mt-20 border-t border-rule">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-rust">
                  Printables
                </p>
                <h2 className="mt-2 font-display text-4xl">
                  One sheet for the fridge
                </h2>
                <p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">
                  Start with the grocery-week checklist. More sheets on the
                  printables page.
                </p>
              </div>
              <Link
                href="/resources"
                className="text-sm font-medium text-pine hover:text-rust"
              >
                All printables →
              </Link>
            </div>
            <div className="mt-8 max-w-md">
              <ResourceCard
                resource={featuredPrintable}
                previewVariant="fridge"
              />
            </div>
          </div>
        </section>
      ) : null}

      <section id="shop" className="scroll-mt-20 border-t border-rule">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-rust">Shop</p>
              <p className="mt-2 font-display text-2xl">Club goods</p>
              <p className="mt-1 text-sm leading-6 text-ink-soft">
                Crest, pup, penguin. Optional.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex h-11 items-center rounded-full border border-ink px-5 text-sm font-semibold hover:bg-ink hover:text-paper"
            >
              Browse the shop →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
