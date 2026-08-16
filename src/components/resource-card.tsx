import Link from "next/link";
import type { Resource } from "@/lib/resources";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="flex flex-col rounded-2xl border border-rule bg-paper p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-pine">
        Free · no email
      </p>
      <h3 className="mt-3 font-display text-2xl leading-tight">
        <Link
          href={`/resources/${resource.slug}`}
          className="hover:text-rust"
        >
          {resource.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-ink-soft">{resource.excerpt}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/resources/${resource.slug}`}
          className="rounded-full border border-ink px-3 py-1.5 text-sm font-semibold hover:bg-ink hover:text-paper"
        >
          Preview
        </Link>
        <Link
          href={`/resources/${resource.slug}#print`}
          className="rounded-full bg-pine px-3 py-1.5 text-sm font-semibold text-paper hover:bg-pine-2"
        >
          {resource.printLabel}
        </Link>
      </div>
    </article>
  );
}
