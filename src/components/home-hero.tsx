import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { SiteTagline } from "@/components/site-tagline";
import { site } from "@/lib/site";

const TRUST_LINE =
  "Sent every Sunday at 9 AM CT. Free forever. Unsubscribe anytime.";

export function HomeHero() {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-10 sm:px-6 lg:pt-16 lg:pb-12">
        <div className="max-w-4xl">
          <SiteTagline as="h1" size="hero" />
          <p className="mt-6 font-display text-2xl leading-snug text-ink sm:text-3xl">
            The Dad Operating System
          </p>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
            No-fluff guides and weekly tactical checklists to run your family
            budget, time, and home.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start">
            <div className="w-full max-w-md">
              <NewsletterForm
                variant="inline"
                source="homepage_hero"
                submitLabel="Get the checklist"
                successMessage={site.weekStart.success}
                successHref="/resources/grocery-week-checklist"
                successLinkLabel="Open the full grocery checklist"
                trustLine={TRUST_LINE}
              />
            </div>
            <Link
              href="#start-here"
              className="inline-flex h-12 items-center justify-center rounded-md border border-rule bg-paper px-6 text-sm font-semibold text-ink transition hover:border-pine hover:text-pine"
            >
              Browse guides
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
