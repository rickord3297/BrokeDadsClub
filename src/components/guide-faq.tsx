import type { GuideFaq } from "@/lib/guide-model";

export function GuideFaqAccordion({ items }: { items: GuideFaq[] }) {
  if (!items.length) return null;

  return (
    <section className="mt-12 border-t border-rule pt-8" id="quick-answers">
      <h2 className="font-display text-3xl">Quick answers</h2>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-xl border border-rule bg-paper open:border-pine/30 open:bg-paper-2/50"
          >
            <summary className="cursor-pointer list-none px-4 py-3 font-display text-xl leading-snug marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                <span>{item.question}</span>
                <span
                  aria-hidden
                  className="mt-1 shrink-0 text-sm font-semibold text-pine transition group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="border-t border-rule/80 px-4 py-3 text-base leading-7 text-ink-soft">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
