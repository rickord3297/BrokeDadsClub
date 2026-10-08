import type { Metadata } from "next";
import { FillCheck, FillLine } from "@/components/fillable-fields";
import { ResourceLayout } from "@/components/resource-layout";
import { requireResource } from "@/lib/resources";
import { resourcePageMetadata } from "@/lib/seo";

const resource = requireResource("trunk-dinner-kit");

export const metadata: Metadata = resourcePageMetadata(resource);

const kit = [
  {
    group: "Protein",
    items: [
      { name: "check-tuna", label: "Tuna or chicken pouches (2-3)" },
      { name: "check-pb", label: "Peanut butter crackers or nut-butter packs" },
      { name: "check-milk", label: "Shelf-stable milk boxes (optional)" },
    ],
  },
  {
    group: "Carb",
    items: [
      { name: "check-crackers", label: "Crackers" },
      { name: "check-tortillas", label: "Tortillas in a zip bag (mild climates)" },
      { name: "check-oats", label: "Instant oatmeal cups (optional)" },
    ],
  },
  {
    group: "Fruit-ish + water",
    items: [
      { name: "check-applesauce", label: "Applesauce pouches or fruit cups" },
      { name: "check-water", label: "Two water bottles you actually replace" },
      { name: "check-wipes", label: "One wipe pack" },
    ],
  },
];

export default function TrunkDinnerKitPage() {
  return (
    <ResourceLayout resource={resource}>
      <div className="space-y-8 print:space-y-4">
        <div>
          <h2 className="font-display text-3xl print:text-xl">Who / where</h2>
          <FillLine name="car" label="Car / tote" placeholder="Trunk bin" />
          <FillLine
            name="restock-day"
            label="Restock day"
            placeholder="Grocery Sunday"
            wide
          />
        </div>

        <div>
          <h2 className="font-display text-3xl print:text-xl">The kit</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft print:mt-1">
            If it needs a fridge, it is not a trunk kit. Boring survives heat.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 print:mt-2 print:gap-3">
            {kit.map((section) => (
              <div
                key={section.group}
                className="break-inside-avoid rounded-xl border border-rule/80 bg-paper-2/30 p-3 print:border-black/20 print:bg-white print:p-2"
              >
                <h3 className="font-display text-lg print:text-base">
                  {section.group}
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {section.items.map((item) => (
                    <FillCheck key={item.name} name={item.name}>
                      {item.label}
                    </FillCheck>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="break-inside-avoid rounded-xl border-2 border-ink/30 p-4 print:border-black print:p-3">
          <h2 className="font-display text-3xl print:text-xl">Never pack</h2>
          <ul className="mt-3 space-y-1.5 print:mt-2">
            <FillCheck name="skip-chocolate">Chocolate in summer</FillCheck>
            <FillCheck name="skip-yogurt">Yogurt / anything that leaks</FillCheck>
            <FillCheck name="skip-drive-thru">Leftover drive-thru</FillCheck>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-3xl print:text-xl">Restock log</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Check this when you do the grocery week. Same trip. Same brain.
          </p>
          {Array.from({ length: 3 }, (_, index) => (
            <FillLine
              key={index}
              name={`restock-${index}`}
              label="Date / what"
              placeholder="9/28 · water + pouches"
              wide
            />
          ))}
        </div>

        <div className="break-inside-avoid rounded-xl border border-rule/80 bg-paper-2/30 p-4 print:border-black/20 print:bg-white print:p-3">
          <h2 className="font-display text-2xl print:text-lg">
            When you still stop at the pump
          </h2>
          <p className="mt-2 text-base leading-7 print:text-sm print:leading-5">
            Kit empty. Hours from home. Someone needs hot food now. Buy protein
            plus fruit. Say the line. Move on.
          </p>
          <p className="mt-3 font-display text-lg print:text-base">
            &ldquo;This is dinner tonight. Tomorrow we cook.&rdquo;
          </p>
        </div>
      </div>
    </ResourceLayout>
  );
}
