import { NewsletterForm } from "@/components/newsletter-form";
import { RecapTopics } from "@/components/recap-topics";
import { site } from "@/lib/site";

export function GuideEmailCta({ source }: { source: string }) {
  return (
    <aside className="my-10 rounded-2xl border border-rule bg-paper-2 px-5 py-6 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
        {site.weekStart.kicker}
      </p>
      <p className="mt-2 font-display text-2xl leading-snug">
        {site.weekStart.title}
      </p>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{site.weekStart.body}</p>
      <div className="mt-3">
        <RecapTopics />
      </div>
      <div className="mt-4">
        <NewsletterForm
          variant="article"
          source={source}
          submitLabel={site.weekStart.button}
          successMessage={site.weekStart.success}
          successHref="/guides/the-second-bill"
          successLinkLabel="Read this week’s guide"
        />
      </div>
    </aside>
  );
}
