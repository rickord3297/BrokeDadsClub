import type { Metadata } from "next";
import Link from "next/link";
import { formatIssueNumber, getLatestIssue } from "@/lib/newsletter";
import { NOINDEX } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "You're in",
  ...NOINDEX,
};

/** Picks up a new latest issue each week without a deploy. */
export const revalidate = 3600;

const NEXT_STEPS = [
  {
    kicker: "Start here",
    title: "The $47 grocery-week checklist",
    body: "Seven dinners, every item covering two nights. Print it or fill it in on your phone.",
    href: "/resources/grocery-week-checklist",
    cta: "Open the checklist",
  },
  {
    kicker: "Then",
    title: "Browse the guides",
    body: "Money, time, and home. Short reads with real numbers, built for a tired Tuesday.",
    href: "/guides",
    cta: "See the guides",
  },
] as const;

export default function ThankYouPage() {
  const latest = getLatestIssue();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <section className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
          The Sunday Dispatch
        </p>
        <h1 className="mt-3 font-display text-5xl leading-tight text-ink sm:text-6xl">
          You&apos;re in.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-ink-soft">
          Your first email lands Sunday at 9 a.m. Central. One tactic, a few real
          numbers, done in four minutes. Free, and you can unsubscribe anytime.
        </p>
      </section>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {NEXT_STEPS.map((step) => (
          <Link
            key={step.href}
            href={step.href}
            className="group flex flex-col rounded-xl border border-rule bg-paper p-6 transition hover:border-pine"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-rust">
              {step.kicker}
            </span>
            <span className="mt-2 font-display text-2xl leading-snug text-ink">
              {step.title}
            </span>
            <span className="mt-2 flex-1 text-sm leading-6 text-ink-soft">{step.body}</span>
            <span className="mt-5 text-sm font-semibold text-pine group-hover:text-rust">
              {step.cta} →
            </span>
          </Link>
        ))}
      </div>

      {latest ? (
        <section className="mt-6 rounded-xl bg-pine px-6 py-7 text-paper sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            While you wait · {formatIssueNumber(latest.issueNumber)}
          </p>
          <p className="mt-2 font-display text-2xl leading-snug">{latest.title}</p>
          {latest.excerpt ? (
            <p className="mt-2 text-sm leading-6 text-paper/80">{latest.excerpt}</p>
          ) : null}
          <Link
            href={`/newsletter/${latest.slug}`}
            className="mt-5 inline-flex h-11 items-center rounded-full bg-gold px-5 text-sm font-semibold text-ink transition hover:bg-paper"
          >
            Read the latest issue
          </Link>
        </section>
      ) : null}

      <p className="mt-10 text-center text-sm leading-6 text-ink-soft">
        So it doesn&apos;t land in spam, add{" "}
        <span className="font-semibold text-ink">{site.email}</span> to your contacts.
      </p>
    </div>
  );
}
