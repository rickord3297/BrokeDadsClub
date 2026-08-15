import Link from "next/link";
import { GuideMark } from "@/components/guide-mark";
import { formatDate } from "@/lib/format";
import type { Guide } from "@/lib/guides";

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-rule bg-paper hover:border-pine"
    >
      <div className="flex items-center gap-3 border-b border-rule bg-paper-2 px-5 py-3">
        <GuideMark category={guide.category} />
        <span className="rounded-full bg-rust/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-rust-2">
          {guide.category}
        </span>
        <span className="ml-auto rounded-full bg-pine/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-pine">
          {guide.readTime}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-2xl leading-tight group-hover:text-rust">
          {guide.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-ink-soft">{guide.excerpt}</p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <p className="text-xs text-ink-soft">{formatDate(guide.publishedAt)}</p>
          <span className="text-sm font-semibold text-pine group-hover:text-rust">
            Read →
          </span>
        </div>
      </div>
    </Link>
  );
}
