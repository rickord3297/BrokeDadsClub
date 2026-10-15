import { NewsletterForm } from "@/components/newsletter-form";

/** Last call on the homepage for visitors who scrolled the whole page without signing up. */
export function HomeFinalSignup() {
  return (
    <section className="border-t border-rule bg-pine text-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-center lg:py-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Free grocery list
          </p>
          <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
            7 family dinners for $44. One page.
          </h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-paper/80">
            The whole Walmart cart, which two dinners each item covers, and a swap
            for when prices jump. Sent to your inbox now, then one short tactic
            every Sunday.
          </p>
        </div>
        <div className="rounded-xl bg-paper p-5 text-ink sm:p-6">
          <NewsletterForm
            variant="inline"
            source="homepage_final"
            submitLabel="Get the free list"
            redirectTo="/thank-you"
            trustLine="Free. One email on Sundays. Unsubscribe anytime."
          />
        </div>
      </div>
    </section>
  );
}
