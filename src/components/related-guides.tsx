import Link from "next/link";
import type { Guide } from "@/lib/guides";

export function RelatedGuides({ guides }: { guides: Guide[] }) {
  if (!guides.length) return null;

  return (
    <section className="mt-12 border-t border-rule pt-8">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Keep reading</p>
      <h2 className="mt-2 font-display text-3xl">Related guides</h2>
      <ul className="mt-5 space-y-3">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/guides/${guide.slug}`}
              className="group block rounded-xl border border-rule bg-paper px-4 py-3 hover:border-pine"
            >
              <span className="text-xs uppercase tracking-[0.14em] text-ink-soft">
                {guide.category}
              </span>
              <span className="mt-1 block font-display text-xl group-hover:text-rust">
                {guide.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
