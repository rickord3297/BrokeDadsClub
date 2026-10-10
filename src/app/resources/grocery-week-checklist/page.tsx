import type { Metadata } from "next";
import { FillCheck, FillLine } from "@/components/fillable-fields";
import { ResourceLayout } from "@/components/resource-layout";
import { WeekMealPlan } from "@/components/week-meal-plan";
import { requireResource } from "@/lib/resources";
import { resourcePageMetadata } from "@/lib/seo";

const resource = requireResource("grocery-week-checklist");

export const metadata: Metadata = resourcePageMetadata(resource);

const cart = [
  {
    group: "Protein",
    target: "about $19",
    paidName: "paid-protein",
    items: [
      { name: "check-thighs", label: "Chicken thighs, bone-in, 4 lb bag (Mon + Tue)" },
      { name: "check-beef", label: "Ground beef, 1 lb (Wed + Thu)" },
      { name: "check-eggs", label: "Eggs, 18 count (Fri + Sun)" },
      { name: "check-beans", label: "Black beans, 2 cans (Thu + Sat)" },
    ],
  },
  {
    group: "Starch",
    target: "about $11",
    paidName: "paid-starch",
    items: [
      { name: "check-rice", label: "Rice, 5 lb (Mon + Thu + Sun)" },
      { name: "check-potatoes", label: "Russet potatoes, 5 lb (Fri + Sat)" },
      { name: "check-tortillas", label: "Burrito tortillas, 8 count (Tue)" },
      { name: "check-pasta", label: "Spaghetti, 1 lb (Wed)" },
      { name: "check-bread", label: "1 loaf bread (Fri)" },
    ],
  },
  {
    group: "Produce",
    target: "about $7",
    paidName: "paid-produce",
    items: [
      { name: "check-onions", label: "Yellow onions, 3 lb bag" },
      { name: "check-frozen", label: "Frozen mixed vegetables (4 bags)" },
    ],
  },
  {
    group: "Dairy and pantry",
    target: "about $7.50",
    paidName: "paid-pantry",
    items: [
      { name: "check-cheddar", label: "Shredded cheddar, 16 oz (Tue + Thu + Sat)" },
      { name: "check-sauce", label: "Pasta sauce, 24 oz (Wed)" },
      { name: "check-salsa", label: "Salsa, 16 oz (Tue + Thu)" },
    ],
  },
];

const week = [
  {
    day: "Mon",
    plan: "Bake the whole chicken bag with an onion. Eat half. Rice and frozen veg. Cook double rice.",
  },
  {
    day: "Tue",
    plan: "Pull the leftover chicken off the bone. Quesadillas with cheese and salsa.",
  },
  {
    day: "Wed",
    plan: "Brown the pound of beef with an onion. Half into the spaghetti sauce, half saved. Veg in the pot.",
  },
  { day: "Thu", plan: "Taco bowls: saved beef plus a can of black beans over rice, cheese, salsa. Extra rice." },
  { day: "Fri", plan: "Breakfast for dinner: eggs, skillet potatoes with onion, toast." },
  { day: "Sat", plan: "Baked potato bar: beans, cheese, a bag of veg." },
  { day: "Sun", plan: "Fried rice: Thursday's rice, eggs, onion, last bag of veg, any chicken left." },
];

export default function GroceryWeekChecklistPage() {
  return (
    <ResourceLayout resource={resource}>
      <div className="space-y-10 print:space-y-5">
        <div>
          <h2 className="font-display text-3xl">Who this feeds</h2>
          <p className="mt-3 text-base leading-7">
            <strong>Seven dinners for 3-4 people.</strong> Every item covers
            two nights, so nothing gets bought for one dinner. This cart came to
            $44.04 at Walmart in October 2026.
          </p>
          <p className="mt-3 text-base leading-7 text-ink-soft">
            Breakfast and lunch are a separate line: oats, peanut butter, two
            more loaves, bananas, milk, and yogurt run about $28 more.
            Teenagers: add a second pound of beef and more rice.
          </p>
          <FillLine name="family-size" label="Family size" placeholder="3-4" />
          <FillLine name="hard-number" label="Hard number" placeholder="$47" />
        </div>

        <div>
          <h2 className="font-display text-3xl">The three rules</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-base leading-7">
            <li>
              <strong>Buy for pairs.</strong> If an item only shows up one
              night, it gets a second job or stays on the shelf.
            </li>
            <li>
              <strong>Shop once.</strong> A second trip is how $47 becomes $90.
            </li>
            <li>
              <strong>Cook the whole pack.</strong> Tuesday and Thursday are
              Monday and Wednesday with a different name.
            </li>
          </ol>
        </div>

        <div>
          <h2 className="font-display text-3xl">Already at home</h2>
          <p className="mt-3 text-sm text-ink-soft">
            Check these before you buy them again. Oil, salt, and a jar of
            something in the door count.
          </p>
          <div className="mt-3">
            {Array.from({ length: 5 }, (_, index) => (
              <FillLine key={index} name={`already-home-${index}`} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-3xl">The cart</h2>
          <p className="mt-3 text-base leading-7 text-ink-soft">
            Store brand, Walmart prices from October 2026: $44.04 total. Skip
            anything you already have. Type what you actually paid next to the
            category target.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {cart.map((section) => (
              <div key={section.group} className="break-inside-avoid rounded-xl border border-rule/80 bg-paper-2/30 p-4 print:border-black/20 print:bg-white">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl">{section.group}</h3>
                  <p className="text-sm font-medium">Target {section.target}</p>
                </div>
                <FillLine
                  name={section.paidName}
                  label="Paid $"
                  placeholder="0.00"
                />
                <ul className="mt-3 space-y-2">
                  {section.items.map((item) => (
                    <FillCheck key={item.name} name={item.name}>
                      {item.label}
                    </FillCheck>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 break-inside-avoid rounded-xl border border-rule/80 bg-paper-2/30 p-4 md:max-w-[calc(50%-0.75rem)] print:border-black/20 print:bg-white">
            <h3 className="font-display text-xl">Only if you need it</h3>
            <ul className="mt-3 space-y-2">
              <FillCheck name="check-oil">
                Cooking oil if the pantry is empty
              </FillCheck>
              <FillCheck name="check-milk">
                Milk (breakfast line, not the $47)
              </FillCheck>
            </ul>
          </div>
        </div>

        <div className="break-inside-avoid rounded-xl border-2 border-ink/30 p-4 print:border-black">
          <h2 className="font-display text-3xl">Swap box</h2>
          <p className="mt-3 text-base leading-7 text-ink-soft">
            Markdowns are allowed. Keep the shape of the week. Do not add a
            second trip.
          </p>
          <ul className="mt-4 space-y-2">
            <FillCheck name="swap-thighs">
              Chicken bag over $10: second 18 eggs plus two more cans of beans
            </FillCheck>
            <FillCheck name="swap-beef">
              Beef over $7/lb: veg spaghetti and all-bean taco bowls
            </FillCheck>
            <FillCheck name="swap-potatoes">
              Potatoes over $5: rice Friday, a second box of pasta Saturday
            </FillCheck>
          </ul>
          <FillLine
            name="markdown-note"
            label="Markdown"
            placeholder="What you swapped"
            wide
          />
        </div>

        <div>
          <h2 className="font-display text-3xl">The week</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Dinner plan at a glance. Each pair is one purchase, two nights.
          </p>
          <WeekMealPlan days={week} />
        </div>
      </div>
    </ResourceLayout>
  );
}
