import { SHOP_FAQ } from "@/lib/product-display";

export function ShopFaq() {
  return (
    <section className="mt-12 border-t border-rule pt-8" id="shop-faq">
      <h2 className="font-display text-3xl">Shop FAQ</h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
        Quick answers before you check out.
      </p>
      <div className="mt-6 space-y-3">
        {SHOP_FAQ.map((item) => (
          <details
            key={item.question}
            className="group rounded-xl border border-rule bg-paper open:border-pine/30 open:bg-paper-2/50"
          >
            <summary className="cursor-pointer list-none px-4 py-3 font-display text-lg leading-snug marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                <span>{item.question}</span>
                <span
                  aria-hidden
                  className="mt-0.5 shrink-0 text-sm font-semibold text-pine transition group-open:rotate-45"
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
