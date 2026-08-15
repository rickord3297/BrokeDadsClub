import Link from "next/link";
import type { Resource } from "@/lib/resources";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link
      href={`/resources/${resource.slug}`}
      className="flex flex-col rounded-2xl border border-rule bg-paper p-5 hover:border-pine"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-pine">
        Free printable
      </p>
      <h3 className="mt-3 font-display text-2xl leading-tight">{resource.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-ink-soft">{resource.excerpt}</p>
      <p className="mt-4 text-sm font-medium text-pine">Print or save PDF →</p>
    </Link>
  );
}
