import type { Metadata } from "next";
import {
  CheckRow,
  ResourceLayout,
  WriteLine,
} from "@/components/resource-layout";
import { requireResource } from "@/lib/resources";
import { site } from "@/lib/site";

const resource = requireResource("school-supply-triage");

export const metadata: Metadata = {
  title: { absolute: `${resource.seoTitle} | Broke Dads Club` },
  description: resource.description,
  keywords: resource.keywords,
  alternates: {
    canonical: `${site.url}/resources/${resource.slug}`,
  },
};

const alreadyOwn = [
  "Backpack (still zips)",
  "Scissors",
  "Leftover binders / folders",
  "Headphones that still work",
  "Pencil box or pouch",
  "Water bottle",
  "Ruler / leftover crayons",
];

const blankRows = Array.from({ length: 8 }, (_, index) => index);

export default function SchoolSupplyTriagePage() {
  return (
    <ResourceLayout resource={resource}>
      <div className="space-y-10 print:space-y-5">
        <div className="break-inside-avoid">
          <h2 className="font-display text-3xl">Already own</h2>
          <p className="mt-3 text-base leading-7 text-ink-soft">
            Inventory the backpack and junk drawer for fifteen minutes before
            you look at the teacher PDF. Check it off. Then triage.
          </p>
          <ul className="mt-4 space-y-2">
            {alreadyOwn.map((item) => (
              <CheckRow key={item}>{item}</CheckRow>
            ))}
            <CheckRow>Other: ____________________________</CheckRow>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-3xl">Before the store</h2>
          <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
            <WriteLine label="Store" />
            <WriteLine label="Budget cap $" wide />
          </div>
          <WriteLine label="Kid / grade" />
          <WriteLine label="Teacher" />
        </div>

        <div>
          <h2 className="font-display text-3xl">Triage the list</h2>
          <p className="mt-3 text-base leading-7 text-ink-soft">
            Copy items from the school PDF into one column. Must: the teacher
            will notice. Reuse: last year still works. Skip: theater, optional
            donations dressed as requirements, the third set of markers.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Must", hint: "Kid cannot function without it" },
              { title: "Reuse", hint: "Already own, still works" },
              { title: "Skip / delay", hint: "Until a teacher actually asks" },
            ].map((column) => (
              <div
                key={column.title}
                className="break-inside-avoid rounded-xl border-2 border-ink/25 p-4 print:border-black"
              >
                <p className="font-display text-xl">{column.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-ink-soft">
                  {column.hint}
                </p>
                <div className="mt-3">
                  {blankRows.map((row) => (
                    <WriteLine key={row} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-3xl">Where to buy</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7">
            <li>What you already have at home</li>
            <li>Dollar aisle / store brand for consumables</li>
            <li>One big-box run with the budget cap already written</li>
            <li>Ask the teacher, quietly, if generic is fine</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-3xl">Scripts</h2>
          <ul className="mt-4 space-y-3 text-base leading-7">
            <li>
              <strong>To your kid:</strong> &ldquo;We&apos;re buying the list, not
              the whole aisle.&rdquo;
            </li>
            <li>
              <strong>To another parent:</strong> &ldquo;We&apos;re keeping it lean
              this year.&rdquo;
            </li>
            <li>
              <strong>To yourself:</strong> &ldquo;This is a season. It is not a
              referendum on my love.&rdquo;
            </li>
          </ul>
        </div>
      </div>
    </ResourceLayout>
  );
}
