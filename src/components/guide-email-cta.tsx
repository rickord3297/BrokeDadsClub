import { NewsletterForm } from "@/components/newsletter-form";
import { site } from "@/lib/site";

/** Sunday email section near the bottom of guide pages. */
export function GuideEmailCta({
  source,
  successHref = "/resources/grocery-week-checklist",
  successLinkLabel = "Print the grocery checklist",
}: {
  source: string;
  successHref?: string;
  successLinkLabel?: string;
}) {
  return (
    <aside
      id="sunday-email"
      className="mt-12 scroll-mt-24 rounded-2xl border border-rule border-l-[3px] border-l-pine bg-paper-2 px-5 py-6 sm:px-6"
      aria-label="Sunday email"
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
        {site.weekStart.kicker}
      </p>
      <p className="mt-2 font-display text-2xl leading-snug">
        {site.weekStart.title}
      </p>
      <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
        {site.weekStart.body}
      </p>
      <div className="mt-5 max-w-md">
        <NewsletterForm
          variant="article"
          source={source}
          submitLabel={site.weekStart.button}
          successMessage={site.weekStart.success}
          successHref={successHref}
          successLinkLabel={successLinkLabel}
        />
      </div>
    </aside>
  );
}
