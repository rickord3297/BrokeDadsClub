import type { Metadata } from "next";
import { FillCheck, FillLine } from "@/components/fillable-fields";
import { ResourceLayout } from "@/components/resource-layout";
import { WeekMealPlan } from "@/components/week-meal-plan";
import { requireResource } from "@/lib/resources";
import { site } from "@/lib/site";

const resource = requireResource("grocery-week-checklist");

export const metadata: Metadata = {
  title: { absolute: `${resource.seoTitle} | Broke Dads Club` },
  description: resource.description,
  keywords: resource.keywords,
  alternates: {
    canonical: `${site.url}/resources/${resource.slug}`,
  },
};

const cart = [
  {
    group: "Protein",
    target: "about $12",
    paidName: "paid-protein",
    items: [
      { name: "check-eggs", label: "Dozen eggs" },
      { name: "check-thighs", label: "2-3 lb chicken thighs (family pack)" },
    ],
  },
  {
    group: "Starch (pick what is cheaper)",
    target: "about $8",
    paidName: "paid-starch",
    items: [
      { name: "check-rice", label: "2 lb rice or a bag of potatoes" },
      { name: "check-bread", label: "1 loaf bread or 1 pack tortillas" },
      { name: "check-pasta", label: "1 lb pasta" },
    ],
  },
  {
    group: "Produce",
    target: "about $10",
    paidName: "paid-produce",
    items: [
      { name: "check-onions", label: "2 onions" },
      { name: "check-frozen", label: "Frozen mixed vegetables (2 bags)" },
      { name: "check-bananas", label: "1 bunch bananas" },
      { name: "check-fruit", label: "1 other fruit the kids will actually eat" },
    ],
  },
  {
    group: "Dairy and pantry",
    target: "about $12",
    paidName: "paid-pantry",
    items: [
      { name: "check-cheddar", label: "8 oz cheddar" },
      { name: "check-beans", label: "2 cans beans" },
      { name: "check-pb", label: "Peanut butter" },
      { name: "check-sauce", label: "1 jar salsa or pasta sauce" },
      { name: "check-oats", label: "Oats" },
      { name: "check-snack", label: "1 planned snack (store-brand cookies or popcorn)" },
    ],
  },
];

const week = [
  {
    day: "Mon",
    plan: "Bake the thighs with onions, rice, and a bag of frozen veg. Cook extra rice.",
  },
  {
    day: "Tue",
    plan: "Leftover chicken in tortillas with cheese and salsa. Kids will call this tacos.",
  },
  {
    day: "Wed",
    plan: "Pasta + sauce. Dump the second bag of veg in the pot. This is the tired night on purpose.",
  },
  { day: "Thu", plan: "Bean and rice bowls. Cheddar on top. Banana for dessert." },
  { day: "Fri", plan: "Grilled cheese or egg sandwiches, leftover fruit." },
  { day: "Sat", plan: "Breakfast-for-dinner: eggs, toast or oats, whatever fruit is left." },
  { day: "Sun", plan: "Leftovers. Soup only if you feel like it. No carcass homework." },
];

export default function GroceryWeekChecklistPage() {
  return (
    <ResourceLayout resource={resource}>
      <div className="space-y-10 print:space-y-5">
        <div>
          <h2 className="font-display text-3xl">Who this feeds</h2>
          <p className="mt-3 text-base leading-7">
            About <strong>3-4 people</strong> for a week: dinners, plus breakfast
            and lunch that are not another store trip. Oats or peanut-butter
            toast in the morning. Leftovers or another PB sandwich at lunch.
          </p>
          <p className="mt-3 text-base leading-7 text-ink-soft">
            Teenagers: add a second pack of thighs and more rice. If someone
            drinks milk, write it in. That is usually the first thing that
            pushes the ticket past $47.
          </p>
          <FillLine name="family-size" label="Family size" placeholder="3-4" />
          <FillLine name="hard-number" label="Hard number" placeholder="$47" />
        </div>

        <div>
          <h2 className="font-display text-3xl">The three rules</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-base leading-7">
            <li>
              <strong>Shop once.</strong> A second trip is how $47 becomes $90.
            </li>
            <li>
              <strong>Cook extra on Monday.</strong> Tuesday and Thursday are
              leftovers with a different name.
            </li>
            <li>
              <strong>Name one snack.</strong> Unplanned snacks are the leak.
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
            Store brand. This is a target of about $47 in most US stores, not a
            dare. Skip anything you already have. Type what you actually paid
            next to the category target.
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
              <FillCheck name="check-milk">Gallon of milk</FillCheck>
              <FillCheck name="check-oil">
                Butter or oil if the pantry is empty
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
              Thighs high: ground turkey, or extra beans plus a second dozen eggs
            </FillCheck>
            <FillCheck name="swap-pasta">
              Pasta night: extra beans if the sauce jar is pricey
            </FillCheck>
            <FillCheck name="swap-fruit">
              Fruit: whatever is marked down that the kids will eat
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
            Dinner plan at a glance. Cook extra Monday for leftover nights.
          </p>
          <WeekMealPlan days={week} />
        </div>
      </div>
    </ResourceLayout>
  );
}
