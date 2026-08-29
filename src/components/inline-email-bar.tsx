import { NewsletterForm } from "@/components/newsletter-form";
import { site } from "@/lib/site";

const TRUST_LINE =
  "Sent every Sunday at 9 AM CT. Free forever. Unsubscribe anytime.";

export function InlineEmailBar({
  source,
  successHref = "/resources/grocery-week-checklist",
  successLinkLabel = "Print the grocery checklist",
  embedded = false,
}: {
  source: string;
  successHref?: string;
  successLinkLabel?: string;
  embedded?: boolean;
}) {
  const content = (
    <div className={embedded ? "" : "mx-auto max-w-6xl px-4 section-pad-sm sm:px-6"}>
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pine">
          {site.weekStart.kicker}
        </p>
        <h2 className="mt-2 font-display text-3xl leading-snug sm:text-[2rem]">
          {site.weekStart.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          {site.weekStart.body}
        </p>
        <div className="mt-5">
          <NewsletterForm
            variant="inline"
            source={source}
            submitLabel={site.weekStart.button}
            successMessage={site.weekStart.success}
            successHref={successHref}
            successLinkLabel={successLinkLabel}
            trustLine={TRUST_LINE}
          />
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return (
      <aside
        className="mt-8 rounded-2xl border border-pine/20 border-l-[3px] border-l-pine bg-pine/[0.06] px-5 py-6 sm:px-7"
        aria-label="Sunday email"
      >
        {content}
      </aside>
    );
  }

  return (
    <section
      id="sunday-email"
      className="scroll-mt-20 border-y border-rule bg-rust/[0.06]"
    >
      {content}
    </section>
  );
}
