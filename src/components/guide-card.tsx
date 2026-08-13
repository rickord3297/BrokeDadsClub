import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Guide } from "@/lib/guides";

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="flex flex-col rounded-2xl border border-rule bg-paper p-5 hover:border-pine"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-rust/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-rust-2">
          {guide.category}
        </span>
        <span className="rounded-full bg-pine/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-pine">
          {guide.readTime}
        </span>
      </div>
      <h3 className="mt-3 font-display text-2xl leading-tight">{guide.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-ink-soft">{guide.excerpt}</p>
      <p className="mt-4 text-xs text-ink-soft">{formatDate(guide.publishedAt)}</p>
    </Link>
  );
}
