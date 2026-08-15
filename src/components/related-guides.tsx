import { GuideCard } from "@/components/guide-card";
import type { Guide } from "@/lib/guides";

export function RelatedGuides({ guides }: { guides: Guide[] }) {
  if (!guides.length) return null;

  return (
    <section className="mt-12 border-t border-rule pt-8">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Keep reading</p>
      <h2 className="mt-2 font-display text-3xl">Related guides</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {guides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </section>
  );
}
