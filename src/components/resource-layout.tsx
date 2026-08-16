import Link from "next/link";
import { GuideEmailCta } from "@/components/guide-email-cta";
import { PrintButton } from "@/components/print-button";
import { otherResources, type Resource } from "@/lib/resources";

export function ResourceLayout({
  resource,
  children,
}: {
  resource: Resource;
  children: React.ReactNode;
}) {
  const related = otherResources(resource.slug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust print:hidden">
        Free printable
      </p>
      <p className="hidden font-stamp text-xs uppercase tracking-[0.16em] text-rust print:block">
        Broke Dads Club · brokedadsclub.com
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
        {resource.title}
      </h1>
      <p className="mt-4 text-lg leading-8 text-ink-soft">{resource.excerpt}</p>
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
        <PrintButton label={resource.printLabel} />
      </div>

      <section className="mt-10">{children}</section>

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
    <li className="flex gap-3 text-base leading-7">
      <span
        className="mt-1 inline-block h-4 w-4 shrink-0 rounded border border-rule"
        aria-hidden
      />
      <span>{children}</span>
    </li>
  );
}

export function WriteLine({ label }: { label?: string }) {
  return (
    <div className="flex min-h-10 items-end gap-3 border-b border-rule py-2">
      {label ? (
        <span className="w-28 shrink-0 text-sm font-medium text-ink-soft">
          {label}
        </span>
      ) : null}
      <span className="min-h-6 flex-1" />
    </div>
  );
}
