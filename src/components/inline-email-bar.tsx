import { NewsletterForm } from "@/components/newsletter-form";
import { site } from "@/lib/site";

export function InlineEmailBar({
  source,
  successHref = "/resources/grocery-week-checklist",
  successLinkLabel = "Print the grocery checklist",
}: {
  source: string;
  successHref?: string;
  successLinkLabel?: string;
}) {
  return (
    <section
      id="sunday-email"
      className="scroll-mt-20 border-t border-rule bg-paper-2/30"
    >
      <div className="mx-auto max-w-6xl px-4 section-pad sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pine">
            {site.weekStart.kicker}
          </p>
          <h2 className="mt-3 font-display text-3xl leading-snug sm:text-4xl">
            {site.weekStart.title}
          </h2>
          <p className="mt-3 text-base leading-7 text-ink-soft">
            {site.weekStart.body}
          </p>
          <div className="mt-8">
            <NewsletterForm
              variant="inline"
              source={source}
              submitLabel={site.weekStart.button}
              successMessage={site.weekStart.success}
              successHref={successHref}
              successLinkLabel={successLinkLabel}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
