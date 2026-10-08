import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { ResourcePreview } from "@/components/resource-preview";
import type { LeadMagnet } from "@/lib/lead-magnets";
import type { Resource } from "@/lib/resources";
import { site } from "@/lib/site";

const TRUST_LINE =
  "Free printable + Sunday dad tactic. Unsubscribe anytime. No daily spam.";

export function LeadMagnetLanding({
  magnet,
  resource,
}: {
  magnet: LeadMagnet;
  resource: Resource;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
        Free printable
      </p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
        {magnet.promise}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        {magnet.heroLine}
      </p>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)]">
        <div className="rounded-2xl border border-rule bg-paper shadow-sm shadow-ink/5">
          <div className="border-b border-rule/80 px-5 py-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-pine">
              What you get
            </p>
            <p className="mt-1 font-display text-2xl leading-snug">
              {resource.title}
            </p>
          </div>
          <ul className="space-y-3 px-5 py-5 sm:px-6">
            {magnet.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3 text-base leading-7">
                <span
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pine"
                  aria-hidden
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-rule/80 bg-paper-2/40 px-5 py-6 sm:px-6">
            <p className="text-sm font-medium text-ink">
              Email unlocks the one-page PDF. That is the whole deal.
            </p>
            <div className="mt-4 max-w-md">
              <NewsletterForm
                variant="inline"
                source={`lead_magnet:${magnet.slug}`}
                submitLabel={magnet.ctaLabel}
                successMessage={magnet.successMessage}
                successHref={`/resources/${resource.slug}`}
                successLinkLabel={magnet.successLinkLabel}
                trustLine={TRUST_LINE}
              />
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-rule bg-paper-2/50 p-6">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
              Preview
            </p>
            <div className="mt-4 flex justify-center">
              <ResourcePreview slug={resource.slug} variant="card" />
            </div>
            <p className="mt-5 text-center text-sm leading-6 text-ink-soft">
              Already on the list?{" "}
              <Link
                href={`/resources/${resource.slug}`}
                className="font-medium text-pine hover:text-rust"
              >
                Open the printable
              </Link>
            </p>
          </div>
          <p className="mt-4 text-sm leading-6 text-ink-soft">
            Full write-up:{" "}
            <Link
              href={`/guides/${resource.guideSlug}`}
              className="font-medium text-pine hover:text-rust"
            >
              {resource.guideLabel}
            </Link>
            . {site.tagline}
          </p>
        </aside>
      </div>
    </div>
  );
}
