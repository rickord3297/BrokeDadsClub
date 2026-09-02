import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { ResourcePreview } from "@/components/resource-preview";
import type { Resource } from "@/lib/resources";
import { site } from "@/lib/site";

const TRUST_LINE =
  "Sent every Sunday at 9 AM CT. Free forever. Unsubscribe anytime.";

const PREVIEW_POINTS = [
  "Protein, starch, produce, and pantry targets for about $47",
  "Swap box for store markdowns without blowing the week",
  "Fillable on your phone or print after signup",
];

/** Homepage preview: full PDF unlocked via Sunday email signup. */
export function GatedResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-rule bg-paper shadow-sm shadow-ink/5">
      <div className="grid lg:grid-cols-[minmax(0,17rem)_1fr]">
        <div className="flex items-center justify-center bg-paper-2/50 p-5 sm:p-6 lg:p-8">
          <ResourcePreview slug={resource.slug} variant="card" />
        </div>
        <div className="flex flex-col justify-center border-t border-rule p-6 sm:p-8 lg:border-t-0 lg:border-l lg:p-8">
          <div className="flex flex-wrap gap-2">
            {resource.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-pine/20 bg-pine/[0.06] px-2.5 py-1 text-[11px] font-medium tracking-wide text-pine"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-rust">
            Preview · full PDF with signup
          </p>
          <h3 className="mt-2 font-display text-2xl leading-tight sm:text-[1.75rem]">
            {resource.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-ink-soft">
            {resource.excerpt}
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-ink">
            {PREVIEW_POINTS.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-pine" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <NewsletterForm
              variant="inline"
              source="homepage_printable_gate"
              submitLabel="Get the full checklist"
              successMessage={site.weekStart.success}
              successHref={`/resources/${resource.slug}`}
              successLinkLabel="Open fillable checklist"
              trustLine={TRUST_LINE}
            />
          </div>
          <p className="mt-4 text-sm leading-6 text-ink-soft">
            <Link
              href={`/guides/${resource.guideSlug}`}
              className="font-medium text-pine hover:text-rust"
            >
              Read {resource.guideLabel} →
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
