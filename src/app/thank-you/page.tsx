import type { Metadata } from "next";
import Link from "next/link";
import { ThankYouLead } from "@/components/thank-you-lead";
import { formatIssueNumber, getLatestIssue } from "@/lib/newsletter";
import { NOINDEX } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "You're in",
  ...NOINDEX,
};

/** Signup sources that already handed over the grocery PDF. */
const PDF_SOURCES = new Set(["free_grocery_list_landing"]);
const DOWNLOAD_HREF = "/api/lead-magnets/grocery-reset-trunk-kit";

const NEXT_STEPS = [
  {
    kicker: "Fill it in on your phone",
    title: "The $47 grocery-week checklist",
    body: "Seven dinners, every item covering two nights. Print it or fill it in on your phone.",
    href: "/resources/grocery-week-checklist",
    cta: "Open the checklist",
  },
] as const;

export default async function ThankYouPage({ searchParams }: PageProps<"/thank-you">) {
  const { from } = await searchParams;
  const gotPdf = typeof from === "string" && PDF_SOURCES.has(from);
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
        {gotPdf ? (
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-ink-soft">
            Your grocery list is downloading. A copy is on its way to your inbox too,
            in case your phone hid the download. After that, one email every Sunday at
            9 a.m. Central. Unsubscribe anytime.
          </p>
        ) : (
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-ink-soft">
            Your grocery list is ready below, and a copy is on its way to your inbox.
            After that, one email every Sunday at 9 a.m. Central. Unsubscribe anytime.
          </p>
        )}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={DOWNLOAD_HREF}
            download
            className="inline-flex h-12 items-center rounded-md bg-pine px-6 text-sm font-semibold text-paper transition hover:bg-pine-2"
          >
            {gotPdf ? "Download didn't start? Get the PDF" : "Download the grocery list (PDF)"}
          </a>
          <Link
            href="/guides"
            className="inline-flex h-12 items-center rounded-md border border-rule bg-paper px-6 text-sm font-semibold text-ink transition hover:border-pine hover:text-pine"
          >
            Browse the guides
          </Link>
        </div>
      </section>
      <ThankYouLead from={typeof from === "string" ? from : undefined} />

      <div className="mt-12 grid gap-4">
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
