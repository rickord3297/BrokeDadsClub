import { NewsletterForm } from "@/components/newsletter-form";

export function GuideEmailCta({ source }: { source: string }) {
  return (
    <aside className="my-10 rounded-2xl border border-rule bg-paper-2 px-5 py-6 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
        Weekly recap
      </p>
      <p className="mt-2 font-display text-2xl leading-snug">
        Get a weekly recap of new content.
      </p>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        One email when something new is up. Quiet weeks stay quiet. Unsubscribe
        whenever.
      </p>
      <div className="mt-4">
        <NewsletterForm
          variant="article"
          source={source}
          submitLabel="Get the recap"
        />
      </div>
    </aside>
  );
}
