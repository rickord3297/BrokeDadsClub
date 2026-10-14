import type { Metadata } from "next";
import Link from "next/link";
import { NOINDEX } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "You're on the list",
  description: "Sunday checklist confirmed. Grab the grocery-week PDF while you wait.",
  ...NOINDEX,
};

/** Dedicated confirmation URL for Meta Ads custom conversions. */
export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">You&apos;re in</p>
      <h1 className="mt-3 font-display text-5xl">Checklist unlocked.</h1>
      <p className="mt-5 text-lg leading-8 text-ink-soft">
        {site.weekStart.success} Open the grocery checklist now, or browse a guide
        while you wait for Sunday.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/resources/grocery-week-checklist"
          className="rounded-full bg-pine px-5 py-3 text-sm font-semibold text-paper hover:bg-pine-2"
        >
          Open the grocery checklist
        </Link>
        <Link
          href="/guides"
          className="rounded-full border border-ink px-5 py-3 text-sm font-semibold hover:border-pine hover:text-pine"
        >
          Browse guides
        </Link>
      </div>
    </div>
  );
}
