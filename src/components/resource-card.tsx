import Link from "next/link";
import { ResourcePreview } from "@/components/resource-preview";
import type { Resource } from "@/lib/resources";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-rule bg-paper">
      <Link href={`/resources/${resource.slug}`} className="block px-4 pt-4">
        <ResourcePreview slug={resource.slug} />
      </Link>
      <div className="flex flex-1 flex-col p-5 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-pine">
          Free · no email
        </p>
        <h3 className="mt-2 font-display text-2xl leading-tight">
          <Link href={`/resources/${resource.slug}`} className="hover:text-rust">
            {resource.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-ink-soft">{resource.excerpt}</p>
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href={`/resources/${resource.slug}#print`}
            className="inline-flex h-12 items-center justify-center rounded-full bg-pine px-4 text-sm font-semibold text-paper hover:bg-pine-2"
          >
            {resource.printLabel}
          </Link>
          <Link
            href={`/resources/${resource.slug}`}
            className="inline-flex h-10 items-center justify-center rounded-full border border-ink px-4 text-sm font-semibold hover:bg-ink hover:text-paper"
          >
            Preview first
          </Link>
        </div>
      </div>
    </article>
  );
}
