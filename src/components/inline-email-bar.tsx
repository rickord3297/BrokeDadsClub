import { NewsletterForm } from "@/components/newsletter-form";
import { site } from "@/lib/site";

export function InlineEmailBar({ source }: { source: string }) {
  return (
    <section
      id="sunday-email"
      className="border-t border-rule bg-pine/5 scroll-mt-20"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-pine/25 bg-paper px-5 py-5 shadow-sm shadow-ink/5 sm:flex sm:items-center sm:gap-6 sm:px-6">
          <div className="sm:max-w-xs sm:shrink-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
              {site.weekStart.kicker}
            </p>
            <p className="mt-1 font-display text-xl leading-snug">
              {site.weekStart.title}
            </p>
            <p className="mt-1 text-sm leading-6 text-ink-soft">
              One note Sundays at 9am Central. Free guides, no spam pile.
            </p>
          </div>
          <div className="mt-4 flex-1 sm:mt-0">
            <NewsletterForm
              variant="article"
              source={source}
              submitLabel={site.weekStart.button}
              successMessage={site.weekStart.success}
              successHref="/guides/the-second-bill"
              successLinkLabel="Read this week’s guide"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
