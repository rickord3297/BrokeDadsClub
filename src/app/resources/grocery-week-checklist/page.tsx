import type { Metadata } from "next";
import Link from "next/link";
import { GuideEmailCta } from "@/components/guide-email-cta";
import { PrintButton } from "@/components/print-button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free $47 Grocery Week Checklist",
  description:
    "Printable grocery-week checklist for feeding a family on a tight budget: cart list, week shape, and the three rules that keep the plan from exploding.",
  alternates: {
    canonical: `${site.url}/resources/grocery-week-checklist`,
  },
};

const cart = [
  "Eggs (18)",
  "Whole chicken or family pack of thighs",
  "Dry rice or a big bag of potatoes",
  "Dried beans or two cans",
  "Oats",
  "Frozen vegetables (two bags)",
  "Bananas + one other fruit that will get eaten",
  "Block of cheddar",
  "Tortillas or a cheap loaf",
  "Onions, garlic, salsa or canned tomatoes",
  "Peanut butter",
  "One planned treat (store-brand cookies count)",
];

const week = [
  { day: "Mon", plan: "Roast chicken (or thighs) over onions + rice + frozen veg" },
  { day: "Tue", plan: "Shredded chicken tortillas with cheese and salsa" },
  { day: "Wed", plan: "Egg fried rice with leftover rice and frozen veg" },
  { day: "Thu", plan: "Beans + rice bowls with cheddar; banana for dessert" },
  { day: "Fri", plan: "Potato hash with leftovers + fried eggs" },
  { day: "Sat", plan: "Peanut-butter toast, oats, fruit, call it brunch" },
  { day: "Sun", plan: "Soup from the carcass or last beans; freeze a quart" },
];

export default async function GroceryWeekChecklistPage({
  searchParams,
}: {
  searchParams: Promise<{ joined?: string }>;
}) {
  const { joined } = await searchParams;
  const justJoined = joined === "1";

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      {justJoined ? (
        <p className="mb-8 rounded-2xl border border-pine/25 bg-pine/10 px-4 py-3 text-sm leading-6 text-pine print:hidden">
          You&apos;re on the Sunday dispatch. Print this checklist, stick it on
          the fridge, and you&apos;re already ahead.
        </p>
      ) : null}

      <p className="text-xs uppercase tracking-[0.18em] text-rust print:hidden">
        Free resource
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
        The $47 grocery-week checklist
      </h1>
      <p className="mt-4 text-lg leading-8 text-ink-soft">
        Fridge-door version of the plan. Shop once, cook once / eat twice, name
        the snack. Full write-up:{" "}
        <Link
          href="/guides/the-47-dollar-grocery-week"
          className="font-medium text-pine hover:text-rust"
        >
          the $47 grocery week
        </Link>
        .
      </p>

      <div className="mt-6 print:hidden">
        <PrintButton />
      </div>

      <section id="checklist" className="mt-10 space-y-10">
        <div>
          <h2 className="font-display text-3xl">The three rules</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-base leading-7">
            <li>
              <strong>Shop once.</strong> A second trip is how $47 becomes $90.
            </li>
            <li>
              <strong>Cook once, eat twice.</strong> Every dinner donates a lunch
              or a second dinner.
            </li>
            <li>
              <strong>Name the snack.</strong> Unplanned snacks are the budget
              leak.
            </li>
          </ol>
        </div>

        <div>
          <h2 className="font-display text-3xl">The cart</h2>
          <ul className="mt-4 space-y-2">
            {cart.map((item) => (
              <li key={item} className="flex gap-3 text-base leading-7">
                <span
                  className="mt-1 inline-block h-4 w-4 shrink-0 rounded border border-rule"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-soft">
            Prices move. Swap chicken for lentils and eggs if needed, keep the
            shape.
          </p>
        </div>

        <div>
          <h2 className="font-display text-3xl">The week</h2>
          <ul className="mt-4 space-y-3">
            {week.map((row) => (
              <li key={row.day} className="flex gap-3 border-b border-rule pb-3">
                <span className="w-10 shrink-0 font-stamp text-sm uppercase tracking-wider text-rust">
                  {row.day}
                </span>
                <span className="text-base leading-7">{row.plan}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-12 print:hidden">
        {justJoined ? null : (
          <GuideEmailCta source="resource:grocery-week-checklist" />
        )}
        <p className="mt-8 text-sm">
          <Link
            href="/guides/the-47-dollar-grocery-week"
            className="text-pine hover:text-rust"
          >
            ← Back to the full guide
          </Link>
        </p>
      </div>
    </div>
  );
}
