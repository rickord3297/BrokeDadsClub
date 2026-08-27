import Link from "next/link";
import { ResourceActionButtons } from "@/components/resource-actions";
import { ResourcePreview } from "@/components/resource-preview";
import type { Resource } from "@/lib/resources";

export function GuidePrintableEmbed({
  resource,
  placement = "inline",
}: {
  resource: Resource;
  placement?: "inline" | "bottom";
}) {
  const compact = placement === "inline";

  return (
    <aside
      className={`rounded-2xl border border-pine/20 bg-pine/[0.05] p-5 sm:p-6 ${
        placement === "bottom" ? "mt-12" : "my-8"
      }`}
      aria-label="Companion printable"
    >
      <div
        className={
          compact
            ? "grid gap-4 sm:grid-cols-[5.5rem_1fr] sm:items-center"
            : "grid gap-5 sm:grid-cols-[7.5rem_1fr] sm:items-center"
        }
      >
        <Link
          href={`/resources/${resource.slug}`}
          className={`mx-auto block sm:mx-0 ${compact ? "w-20" : "w-28 sm:w-full"}`}
        >
          <ResourcePreview slug={resource.slug} variant="sheet" />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pine">
            Companion printable
          </p>
          <h2 className="mt-1 font-display text-xl leading-tight sm:text-2xl">
            <Link
              href={`/resources/${resource.slug}`}
              className="hover:text-rust"
            >
              {resource.title}
            </Link>
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {resource.excerpt}
          </p>
          <div className="mt-4">
            <ResourceActionButtons
              resourceSlug={resource.slug}
              printLabel="Print"
              mode="resource"
              size="compact"
            />
          </div>
          <p className="mt-3 text-sm">
            <Link
              href={`/resources/${resource.slug}`}
              className="font-medium text-pine hover:text-rust"
            >
              Open fillable sheet →
            </Link>
          </p>
        </div>
      </div>
    </aside>
  );
}

/** Other printables only. Related guides live in GuideKeepGoing. */
export function GuideCompanionPrintables({
  printables,
}: {
  printables: Resource[];
}) {
  if (!printables.length) return null;

  return (
    <section className="mt-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
        More printables
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {printables.map((resource) => (
          <Link
            key={resource.slug}
            href={`/resources/${resource.slug}`}
            className="rounded-2xl border border-rule bg-paper p-5 transition hover:border-pine"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-pine">
              Printable
            </p>
            <p className="mt-2 font-display text-xl leading-snug">
              {resource.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              Fill on your phone or print for the fridge.
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
