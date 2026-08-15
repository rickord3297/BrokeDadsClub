import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { RecapTopics } from "@/components/recap-topics";
import { site } from "@/lib/site";

export function WeekStartSignup({
  source,
  compact = false,
}: {
  source: string;
  compact?: boolean;
}) {
  return (
    <aside
      className={`rounded-2xl border border-rule bg-paper-2 text-left ${
        compact ? "px-5 py-5" : "px-5 py-6 sm:px-6"
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
        {site.weekStart.kicker}
      </p>
      <p
        className={`mt-2 font-display leading-snug ${
          compact ? "text-2xl" : "text-3xl"
        }`}
      >
        {site.weekStart.title}
      </p>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{site.weekStart.body}</p>
      {compact ? null : (
        <div className="mt-3">
          <RecapTopics />
        </div>
      )}
      <div className="mt-4">
        <NewsletterForm
          variant="article"
          source={source}
          submitLabel={site.weekStart.button}
          successMessage={site.weekStart.success}
        />
      </div>
      <p className="mt-3 text-sm text-ink-soft">
        Want a sheet on the fridge now?{" "}
        <Link
          href="/resources"
          className="font-medium text-pine underline decoration-rule underline-offset-2 hover:text-rust"
        >
          Open the printables
        </Link>
      </p>
    </aside>
  );
}
