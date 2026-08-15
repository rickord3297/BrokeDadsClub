import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";

export function ChecklistSignup({
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
        Free checklist
      </p>
      <p
        className={`mt-2 font-display leading-snug ${
          compact ? "text-2xl" : "text-3xl"
        }`}
      >
        The $47 grocery-week plan
      </p>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        Cart list, week shape, three rules. Drop your email and we will send it
        with the recap. Quiet weeks stay quiet.
      </p>
      <div className="mt-4">
        <NewsletterForm
          variant="article"
          source={source}
          submitLabel="Send me the checklist"
          successMessage="You're on the list. The checklist is ready."
          successHref="/resources/grocery-week-checklist"
          successLinkLabel="Open the checklist"
        />
      </div>
      <p className="mt-3 text-sm text-ink-soft">
        Skip the inbox?{" "}
        <Link
          href="/resources/grocery-week-checklist"
          className="font-medium text-pine underline decoration-rule underline-offset-2 hover:text-rust"
        >
          Open it now
        </Link>
      </p>
    </aside>
  );
}
