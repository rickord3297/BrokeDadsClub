import Link from "next/link";
import { GuideEmailCta } from "@/components/guide-email-cta";
import { PrintButton } from "@/components/print-button";
import { ResourcePreview } from "@/components/resource-preview";
import { ResourceViewTracker } from "@/components/resource-view-tracker";
import { otherResources, type Resource } from "@/lib/resources";

export function ResourceLayout({
  resource,
  children,
}: {
  resource: Resource;
  children: React.ReactNode;
}) {
  const related = otherResources(resource.slug);
  const fridgePreview =
    resource.slug === "grocery-week-checklist" ||
    resource.slug === "school-supply-triage";

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <ResourceViewTracker slug={resource.slug} />
      <p className="text-xs uppercase tracking-[0.18em] text-rust print:hidden">
        Free printable
      </p>
      <p className="hidden font-stamp text-xs uppercase tracking-[0.16em] text-rust print:block">
        Broke Dads Club · brokedadsclub.com
      </p>
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
        . Print this page, or save it as a PDF from your browser. No email required.
      </p>

      <div className="mt-6 print:hidden">
        <PrintButton label={resource.printLabel} resourceSlug={resource.slug} />
      </div>

      <div className="mt-8 max-w-xs print:hidden">
        <ResourcePreview
          slug={resource.slug}
          variant={fridgePreview ? "fridge" : "sheet"}
        />
      </div>

      <section className="print-sheet mt-10">{children}</section>

      <div className="mt-12 print:hidden">
        <GuideEmailCta source={`resource:${resource.slug}`} />
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
        <p className="mt-8 text-sm">
          <Link href="/resources" className="text-pine hover:text-rust">
            ← All free printables
          </Link>
        </p>
      </div>
    </div>
  );
}

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
