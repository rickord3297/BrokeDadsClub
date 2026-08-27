import { NewsletterForm } from "@/components/newsletter-form";
import { site } from "@/lib/site";

export function GuidesInlineSignup() {
  return (
    <aside className="rounded-2xl border border-pine/25 bg-gradient-to-br from-pine/[0.08] to-paper px-5 py-6 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
        {site.weekStart.kicker}
      </p>
      <p className="mt-2 font-display text-xl leading-snug sm:text-2xl">
        New guide every week
      </p>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        One short note, one useful tactic. No pile of everything you missed.
      </p>
      <div className="mt-4">
        <NewsletterForm
          variant="inline"
          source="guides_index_inline"
          submitLabel={site.weekStart.button}
          successMessage={site.weekStart.success}
          successHref="/guides/the-lonely-dad"
          successLinkLabel="Read the latest guide"
        />
      </div>
    </aside>
  );
}
