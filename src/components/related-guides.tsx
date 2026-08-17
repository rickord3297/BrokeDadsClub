import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import type { Guide } from "@/lib/guides";

export function RelatedGuides({ guides }: { guides: Guide[] }) {
  if (!guides.length) return null;

  const [next, ...rest] = guides;

  return (
    <section className="mt-12 border-t border-rule pt-8">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Keep reading</p>
      <h2 className="mt-2 font-display text-3xl">Related guides</h2>
      {next ? (
        <div className="mt-5 rounded-2xl border border-pine/30 bg-paper-2/60 px-5 py-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-pine">
              Read next
            </p>
            <p className="mt-1 font-display text-2xl leading-tight">{next.title}</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
              {next.excerpt}
            </p>
          </div>
          <Link
            href={`/guides/${next.slug}`}
            className="mt-4 inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-pine px-5 text-sm font-semibold text-paper hover:bg-pine-2 sm:mt-0"
          >
            Read the guide
          </Link>
        </div>
      ) : null}
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {rest.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </section>
  );
}
