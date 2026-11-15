import Link from "next/link";
import { InlineEmailBar } from "@/components/inline-email-bar";
import { JsonLd } from "@/components/json-ld";
import { hasResourceSample } from "@/components/resource-sample";
import {
  ResourceSheetWorkspace,
  type ResourceSampleMode,
} from "@/components/resource-sheet-workspace";
import { ResourceViewTracker } from "@/components/resource-view-tracker";
import { resourceWebPageJsonLd } from "@/lib/seo";
import { otherLiveResources } from "@/lib/printables";
import { resourceIdeaMailto, type Resource } from "@/lib/resources";

export function ResourceLayout({
  resource,
  sampleMode,
  children,
}: {
  resource: Resource;
  sampleMode?: ResourceSampleMode;
  children: React.ReactNode;
}) {
  const related = otherLiveResources(resource.slug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <JsonLd data={resourceWebPageJsonLd(resource)} />
      <ResourceViewTracker slug={resource.slug} />
      <p className="text-xs uppercase tracking-[0.18em] text-rust print:hidden">
        Free printable
      </p>
      <p className="hidden font-stamp text-xs uppercase tracking-[0.16em] text-rust print:block">
        Broke Dads Club · brokedadsclub.com
      </p>

      <div className="mt-3 flex flex-wrap gap-2 print:hidden">
        {resource.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-pine/20 bg-pine/[0.06] px-2.5 py-1 text-[11px] font-medium tracking-wide text-pine"
          >
            {tag}
          </span>
        ))}
      </div>

      <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl print:text-2xl">
        {resource.title}
      </h1>
      <p className="mt-4 text-lg leading-8 text-ink-soft print:hidden">
        {resource.excerpt}
      </p>
      <p className="mt-3 text-base leading-7 text-ink-soft print:hidden">
        {resource.intro}
      </p>
      <p className="mt-3 text-base leading-7 text-ink-soft print:hidden">
        Full write-up:{" "}
        <Link
          href={`/guides/${resource.guideSlug}`}
          className="font-medium text-pine hover:text-rust"
        >
          {resource.guideLabel}
        </Link>
        . Fill on your phone, print this page, or save as a PDF. No email
        required.
      </p>

      <div className="print:hidden">
        <InlineEmailBar
          embedded
          source={`resource-inline:${resource.slug}`}
          title={
            resource.slug === "grocery-week-checklist"
              ? "Email yourself the printable + Sunday tactic"
              : "Get the free $47 grocery list too"
          }
          body={
            resource.slug === "grocery-week-checklist"
              ? "This sheet stays free here. Leave your email for the PDF copy and one short dad tactic every Sunday."
              : "Seven dinners for about $44 at Walmart. This sheet stays free here. The grocery list PDF comes with the Sunday email."
          }
          submitLabel="Get the free list"
          successHref={
            resource.slug === "grocery-week-checklist"
              ? `/resources/${resource.slug}`
              : "/resources/grocery-week-checklist"
          }
          successLinkLabel={
            resource.slug === "grocery-week-checklist"
              ? "Back to this sheet"
              : "Open the grocery checklist"
          }
        />
      </div>

      <ResourceSheetWorkspace
        resourceSlug={resource.slug}
        printLabel={resource.printLabel}
        sampleMode={
          sampleMode ??
          (hasResourceSample(resource.slug) ? "custom" : "inline")
        }
      >
        {children}
      </ResourceSheetWorkspace>

      <div className="mt-12 print:hidden">
        {related.length > 0 ? (
          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.18em] text-rust">
              More free tools
            </p>
            <ul className="mt-3 space-y-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/resources/${item.slug}`}
                    className="font-medium text-pine hover:text-rust"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="mt-10 rounded-xl border border-rule bg-paper-2/60 px-4 py-3 text-sm leading-6 text-ink-soft">
          Need a specific tracker?{" "}
          <a
            href={resourceIdeaMailto}
            className="font-medium text-pine hover:text-rust"
          >
            Email your idea
          </a>{" "}
          and we will put it in the queue.
        </p>

        <p className="mt-8 text-sm">
          <Link href="/resources" className="text-pine hover:text-rust">
            ← All free printables
          </Link>
        </p>
      </div>
    </div>
  );
}

/** @deprecated Prefer FillCheck from fillable-fields for interactive sheets */
export function CheckRow({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-base leading-7">
      <span
        className="mt-0.5 inline-block h-5 w-5 shrink-0 rounded-[3px] border-2 border-ink print:border-black"
        aria-hidden
      />
      <span>{children}</span>
    </li>
  );
}

/** @deprecated Prefer FillLine from fillable-fields for interactive sheets */
export function WriteLine({
  label,
  wide = false,
}: {
  label?: string;
  wide?: boolean;
}) {
  return (
    <div className="flex min-h-11 items-end gap-3 border-b-2 border-ink/25 py-2 print:border-black/40">
      {label ? (
        <span
          className={`shrink-0 text-sm font-medium text-ink ${wide ? "w-36" : "w-32"}`}
        >
          {label}
        </span>
      ) : null}
      <span className="min-h-7 flex-1" />
    </div>
  );
}
