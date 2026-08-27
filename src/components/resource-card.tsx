import Link from "next/link";
import { ResourceActionButtons } from "@/components/resource-actions";
import { ResourcePreview } from "@/components/resource-preview";
import type { Resource } from "@/lib/resources";

export function ResourceCard({
  resource,
  previewVariant = "sheet",
  variant = "default",
}: {
  resource: Resource;
  previewVariant?: "sheet" | "fridge" | "card";
  variant?: "default" | "featured";
}) {
  const featured = variant === "featured";

  if (featured) {
    return (
      <article className="overflow-hidden border border-rule bg-paper shadow-sm shadow-ink/5">
        <div className="grid lg:grid-cols-2">
          <div className="flex items-center justify-center bg-paper-2/50 p-6 sm:p-8 lg:p-10">
            <ResourcePreview slug={resource.slug} variant={previewVariant} />
          </div>
          <div className="flex flex-col justify-center border-t border-rule p-6 sm:p-8 lg:border-t-0 lg:border-l lg:p-10">
            <div className="flex flex-wrap gap-2">
              {resource.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-pine/20 bg-pine/[0.06] px-2.5 py-1 text-[11px] font-medium tracking-wide text-pine"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs text-ink-soft">Free printable · no email</p>
            <h3 className="mt-2 font-display text-2xl leading-tight sm:text-[1.75rem]">
              {resource.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-ink-soft">{resource.excerpt}</p>
            <div className="mt-6 flex flex-col gap-3">
              <ResourceActionButtons
                resourceSlug={resource.slug}
                printLabel="Print"
                mode="resource"
              />
              <p className="text-sm leading-6 text-ink-soft/80">
                <Link
                  href={`/guides/${resource.guideSlug}`}
                  className="transition hover:text-pine"
                >
                  Read {resource.guideLabel} →
                </Link>
                <span className="mx-2 text-ink-soft/40">·</span>
                <Link href="/resources" className="transition hover:text-pine">
                  All printables →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-rule bg-paper shadow-md shadow-ink/5 ring-1 ring-ink/5">
      <Link href={`/resources/${resource.slug}`} className="block px-4 pt-4">
        <ResourcePreview slug={resource.slug} variant={previewVariant} />
      </Link>
      <div className="flex flex-1 flex-col p-5 pt-4">
        <div className="flex flex-wrap gap-1.5">
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-pine/20 bg-pine/[0.06] px-2 py-0.5 text-[10px] font-medium tracking-wide text-pine"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mt-3 font-display text-2xl leading-tight">
          <Link href={`/resources/${resource.slug}`} className="hover:text-rust">
            {resource.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-ink-soft">
          {resource.excerpt}
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <ResourceActionButtons
            resourceSlug={resource.slug}
            printLabel="Print"
            mode="resource"
            size="compact"
          />
          <Link
            href={`/resources/${resource.slug}`}
            className="text-center text-sm font-medium text-pine hover:text-rust"
          >
            Open fillable sheet →
          </Link>
          <Link
            href={`/guides/${resource.guideSlug}`}
            className="text-center text-sm text-ink-soft hover:text-pine"
          >
            Read {resource.guideLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
