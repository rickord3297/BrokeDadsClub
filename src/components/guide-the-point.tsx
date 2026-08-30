import { GuideMarkdown } from "@/components/guide-markdown";

/** Short synthesis block before FAQ and related guides. */
export function GuideThePoint({
  content,
  headingCounts,
}: {
  content: string;
  headingCounts?: Map<string, number>;
}) {
  if (!content.trim()) return null;

  return (
    <section
      id="the-point"
      className="mt-12 scroll-mt-24 border-t border-rule pt-8"
    >
      <h2 className="font-display text-3xl">The point</h2>
      <div className="prose-guide mt-6">
        <GuideMarkdown content={content} headingCounts={headingCounts} />
      </div>
    </section>
  );
}
