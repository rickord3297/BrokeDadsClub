import Link from "next/link";
import { PrintButton } from "@/components/print-button";
import { ResourcePreview } from "@/components/resource-preview";
import type { Resource } from "@/lib/resources";

const featuredPrintClassName =
  "inline-flex h-11 w-full items-center justify-center rounded-md bg-pine px-5 text-sm font-semibold text-paper transition hover:bg-pine-2 sm:w-auto sm:min-w-[13rem]";

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
            <p className="inline-flex w-fit items-center rounded-full border border-pine/20 bg-pine/[0.06] px-2.5 py-1 text-[11px] font-medium tracking-wide text-pine">
              1-Page PDF · Ink-Friendly
            </p>
            <p className="mt-4 text-xs text-ink-soft">Free printable · no email</p>
            <h3 className="mt-2 font-display text-2xl leading-tight sm:text-[1.75rem]">
              {resource.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-ink-soft">{resource.excerpt}</p>
            <div className="mt-6 flex flex-col gap-3">
              <PrintButton
                label="Print / Download PDF"
                resourceSlug={resource.slug}
                mode="resource"
                className={featuredPrintClassName}
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
    <article className="flex flex-col overflow-hidden rounded-2xl border border-rule bg-paper shadow-md shadow-ink/5 ring-1 ring-ink/5">
      <Link href={`/resources/${resource.slug}`} className="block px-4 pt-4">
        <ResourcePreview slug={resource.slug} variant={previewVariant} />
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
          <Link
            href={`/guides/${resource.guideSlug}`}
            className="pt-1 text-center text-sm font-medium text-pine hover:text-rust"
          >
            Read {resource.guideLabel} →
          </Link>
        </div>
      </div>
    </article>
  );
}
