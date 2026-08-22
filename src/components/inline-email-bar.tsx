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
      className="scroll-mt-20 border-t border-rule bg-pine/5"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-pine/25 bg-paper px-5 py-5 shadow-sm shadow-ink/5 sm:flex sm:items-center sm:gap-6 sm:px-6">
          <div className="sm:max-w-sm sm:shrink-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
              {site.weekStart.kicker}
            </p>
            <p className="mt-1 font-display text-xl leading-snug">
              {site.weekStart.title}
            </p>
            <p className="mt-1 text-sm leading-6 text-ink-soft">
              {site.weekStart.body}
            </p>
          </div>
          <div className="mt-4 flex-1 sm:mt-0">
            <NewsletterForm
              variant="article"
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
