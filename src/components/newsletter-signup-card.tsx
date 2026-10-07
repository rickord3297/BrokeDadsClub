import { NewsletterForm } from "@/components/newsletter-form";
import { site } from "@/lib/site";

export function NewsletterSignupCard({
  kicker,
  title,
  body,
  source,
  headingLevel = "h3",
  id,
}: {
  kicker: string;
  title: string;
  body: string;
  source: string;
  headingLevel?: "h2" | "h3";
  id?: string;
}) {
  const Heading = headingLevel;
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <aside
      id={id}
      aria-labelledby={headingId}
      className="scroll-mt-24 rounded-2xl border border-pine/20 border-l-[3px] border-l-pine bg-pine/[0.06] px-5 py-6 sm:px-7"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pine">
            {kicker}
          </p>
          <Heading id={headingId} className="mt-1 font-display text-2xl leading-snug">
            {title}
          </Heading>
          <p className="mt-1 text-sm leading-6 text-ink-soft">{body}</p>
        </div>
        <div className="w-full sm:max-w-sm">
          <NewsletterForm
            variant="inline"
            source={source}
            submitLabel="Keep me posted"
            successMessage={site.weekStart.success}
            successHref="/resources/grocery-week-checklist"
            successLinkLabel="Print the grocery checklist"
          />
        </div>
      </div>
    </aside>
  );
}
