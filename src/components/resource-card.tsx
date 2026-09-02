import Link from "next/link";
import { ResourceActionButtons } from "@/components/resource-actions";
import { ResourcePreview } from "@/components/resource-preview";
import type { Resource } from "@/lib/resources";

function ResourceCardSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rust">
        {label}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ResourceCardTags({ tags }: { tags: Resource["tags"] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.slice(0, 3).map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-pine/20 bg-pine/[0.06] px-2 py-0.5 text-[10px] font-medium tracking-wide text-pine"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

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
        <div className="p-6 sm:p-8 lg:p-10">
          <ResourceCardTags tags={resource.tags} />
          <p className="mt-4 text-xs text-ink-soft">Free printable · no email</p>
          <h3 className="mt-2 font-display text-2xl leading-tight sm:text-[1.75rem]">
            {resource.title}
          </h3>
          <div className="mt-5 space-y-5">
            <ResourceCardSection label="What it is">
              <p className="text-sm leading-6 text-ink-soft">{resource.excerpt}</p>
            </ResourceCardSection>
            <ResourceCardSection label="Details">
              <p className="text-sm leading-6 text-ink-soft">{resource.intro}</p>
            </ResourceCardSection>
          </div>
          <div className="mt-6 flex justify-center bg-paper-2/50 p-6 sm:p-8">
            <ResourcePreview slug={resource.slug} variant={previewVariant} />
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <ResourceActionButtons
              resourceSlug={resource.slug}
              printLabel="Print"
              mode="resource"
            />
            <p className="text-sm leading-6 text-ink-soft">
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
      </article>
    );
  }

  return (
    <article className="flex flex-col rounded-2xl border border-rule bg-paper shadow-md shadow-ink/5 ring-1 ring-ink/5">
      <div className="p-5">
        <h3 className="font-display text-2xl leading-tight">
          <Link href={`/resources/${resource.slug}`} className="hover:text-rust">
            {resource.title}
          </Link>
        </h3>

        <div className="mt-4 space-y-4">
          <ResourceCardSection label="What it is">
            <p className="text-sm leading-6 text-ink-soft">{resource.excerpt}</p>
          </ResourceCardSection>
          <ResourceCardSection label="Details">
            <p className="line-clamp-3 text-sm leading-6 text-ink-soft">
              {resource.intro}
            </p>
            <div className="mt-3">
              <ResourceCardTags tags={resource.tags} />
            </div>
          </ResourceCardSection>
        </div>
      </div>

      <Link
        href={`/resources/${resource.slug}`}
        className="block px-5 pb-5"
      >
        <div className="rounded-xl bg-paper-2/60 p-3">
          <ResourcePreview slug={resource.slug} variant={previewVariant} />
        </div>
      </Link>

      <div className="flex flex-col gap-3 px-5 pb-5">
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
    </article>
  );
}
