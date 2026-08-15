import type { Metadata } from "next";
import { ResourceLayout, WriteLine } from "@/components/resource-layout";
import { requireResource } from "@/lib/resources";
import { site } from "@/lib/site";

const resource = requireResource("school-supply-triage");

export const metadata: Metadata = {
  title: resource.seoTitle,
  description: resource.description,
  alternates: {
    canonical: `${site.url}/resources/${resource.slug}`,
  },
};

const blankRows = Array.from({ length: 8 }, (_, index) => index);

export default function SchoolSupplyTriagePage() {
  return (
    <ResourceLayout resource={resource}>
      <div className="space-y-10">
        <div>
          <h2 className="font-display text-3xl">Before the store</h2>
          <WriteLine label="Hard number" />
          <WriteLine label="Kid / grade" />
          <WriteLine label="Teacher" />
          <p className="mt-3 text-sm text-ink-soft">
            Write the number on your phone too. Inventory the backpack and junk
            drawer for fifteen minutes before you buy a single folder.
          </p>
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
              { title: "Reuse", hint: "Scissors, backpack, headphones" },
              { title: "Skip / delay", hint: "Until a teacher actually asks" },
            ].map((column) => (
              <div key={column.title} className="break-inside-avoid rounded-xl border border-rule p-4">
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
            <li>One big-box run with the hard number already written</li>
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
