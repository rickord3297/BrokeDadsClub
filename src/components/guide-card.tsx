import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Guide } from "@/lib/guides";

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="flex flex-col rounded-2xl border border-rule bg-paper p-5 hover:border-pine"
    >
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-rust">
        <span>{guide.category}</span>
        <span className="text-rule">/</span>
        <span className="text-ink-soft">{guide.readTime}</span>
      </div>
      <h3 className="mt-3 font-display text-2xl leading-tight">{guide.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-ink-soft">{guide.excerpt}</p>
      <p className="mt-4 text-xs text-ink-soft">{formatDate(guide.publishedAt)}</p>
    </Link>
  );
}
