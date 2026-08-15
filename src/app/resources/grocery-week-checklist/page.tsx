import type { Metadata } from "next";
import {
  CheckRow,
  ResourceLayout,
} from "@/components/resource-layout";
import { requireResource } from "@/lib/resources";
import { site } from "@/lib/site";

const resource = requireResource("grocery-week-checklist");

export const metadata: Metadata = {
  title: resource.seoTitle,
  description: resource.description,
  alternates: {
    canonical: `${site.url}/resources/${resource.slug}`,
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

export default function GroceryWeekChecklistPage() {
  return (
    <ResourceLayout resource={resource}>
      <div className="space-y-10">
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
              <CheckRow key={item}>{item}</CheckRow>
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
      </div>
    </ResourceLayout>
  );
}
