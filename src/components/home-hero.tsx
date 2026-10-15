import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { ResourcePreview } from "@/components/resource-preview";
import { SiteTagline } from "@/components/site-tagline";
import { getResource } from "@/lib/resources";

const TRUST_LINE =
  "The PDF lands in your inbox in about a minute. Then one email every Sunday at 9 a.m. CT. Unsubscribe anytime.";

export function HomeHero() {
  const checklist = getResource("grocery-week-checklist");

  return (
    <section className="border-b border-rule">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 pb-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-16 lg:pb-14">
        <div>
          <SiteTagline as="h1" size="hero" />
          <p className="mt-5 font-display text-2xl leading-snug text-ink sm:text-3xl">
            The Dad Operating System
          </p>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
            Get the{" "}
            <strong className="font-semibold text-ink">$47 Grocery Week Checklist</strong>{" "}
            (7 family dinners for $44 at Walmart) plus our free Sunday tactical drop.
          </p>

          <div id="signup" className="mt-7 w-full max-w-md scroll-mt-24">
            <NewsletterForm
              variant="inline"
              source="homepage_hero"
              submitLabel="Get the free grocery list"
              redirectTo="/thank-you"
              trustLine={TRUST_LINE}
            />
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            Just browsing?{" "}
            <Link
              href="#start-here"
              className="font-medium text-pine underline decoration-pine/30 underline-offset-4 hover:text-rust"
            >
              Read the guides
            </Link>
          </p>
        </div>

        {checklist ? (
          <figure>
            <ResourcePreview
              resource={checklist}
              variant="card"
              cardWidthClass="max-w-[19rem] lg:max-w-[22rem]"
            />
            <figcaption className="mt-4 text-center text-sm text-ink-soft">
              The $44 dinner breakdown you get. Every item covers two nights.
            </figcaption>
          </figure>
        ) : null}
      </div>
    </section>
  );
}
