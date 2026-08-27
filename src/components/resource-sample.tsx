import { FillCheck, FillLine } from "@/components/fillable-fields";

/** Static filled examples parents can skim before using the blank sheet. */
export function ResourceSample({ slug }: { slug: string }) {
  if (slug === "grocery-week-checklist") return <GrocerySample />;
  if (slug === "school-supply-triage") return <SchoolSample />;
  if (slug === "birthday-party-budget") return <BirthdaySample />;
  return null;
}

function SampleNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-pine/20 bg-pine/[0.06] px-4 py-3 text-sm leading-6 text-ink-soft">
      {children}
    </p>
  );
}

function GrocerySample() {
  return (
    <div className="space-y-8">
      <SampleNote>
        Example for a family of 4 with a $47 hard number. Numbers are store-brand
        targets, not a dare.
      </SampleNote>
      <div>
        <h2 className="font-display text-3xl">Who this feeds</h2>
        <FillLine name="s-family" label="Family size" sample="4 people" />
        <FillLine name="s-hard" label="Hard number" sample="$47" />
      </div>
      <div>
        <h2 className="font-display text-3xl">Already at home</h2>
        <FillLine name="s-home-1" sample="Olive oil, salt, pepper" />
        <FillLine name="s-home-2" sample="Half jar salsa" />
        <FillLine name="s-home-3" sample="One onion left" />
      </div>
      <div>
        <h2 className="font-display text-3xl">Category paid</h2>
        <FillLine name="s-protein" label="Protein paid" sample="$11.40" />
        <FillLine name="s-starch" label="Starch paid" sample="$7.80" />
        <FillLine name="s-produce" label="Produce paid" sample="$9.50" />
        <FillLine name="s-pantry" label="Pantry paid" sample="$12.10" />
        <FillLine name="s-total" label="Cart total" sample="$45.80" />
      </div>
      <div>
        <h2 className="font-display text-3xl">Swap this week</h2>
        <FillLine
          name="s-swap"
          sample="Thighs were up; used ground turkey instead"
        />
      </div>
    </div>
  );
}

function SchoolSample() {
  return (
    <div className="space-y-8">
      <SampleNote>
        Example for one 3rd grader before a Target run. Cap written first so the
        aisle does not decide.
      </SampleNote>
      <div>
        <h2 className="font-display text-3xl">Before the store</h2>
        <FillLine name="s-store" label="Store" sample="Target" />
        <FillLine name="s-cap" label="Budget cap $" sample="45" wide />
        <FillLine name="s-kid" label="Kid / grade" sample="Maya · 3rd" />
        <FillLine name="s-teacher" label="Teacher" sample="Ms. Ruiz" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border-2 border-ink/25 p-4">
          <p className="font-display text-xl">Must</p>
          <FillLine name="s-must-1" sample="Composition notebooks (2)" />
          <FillLine name="s-must-2" sample="Glue sticks (4)" />
          <FillLine name="s-must-3" sample="#2 pencils (12)" />
        </div>
        <div className="rounded-xl border-2 border-ink/25 p-4">
          <p className="font-display text-xl">Reuse</p>
          <FillLine name="s-reuse-1" sample="Backpack" />
          <FillLine name="s-reuse-2" sample="Scissors" />
          <FillLine name="s-reuse-3" sample="Headphones" />
        </div>
        <div className="rounded-xl border-2 border-ink/25 p-4">
          <p className="font-display text-xl">Skip / delay</p>
          <FillLine name="s-skip-1" sample="Extra tissue boxes" />
          <FillLine name="s-skip-2" sample="Brand-name markers" />
          <FillLine name="s-skip-3" sample="Classroom snacks" />
        </div>
      </div>
    </div>
  );
}

function BirthdaySample() {
  return (
    <div className="space-y-8">
      <SampleNote>
        Example: backyard party for 8 kids with a $80 ceiling. Max per kid is
        written before looking at bounce-house quotes.
      </SampleNote>
      <div>
        <h2 className="font-display text-3xl">The numbers first</h2>
        <FillLine name="s-limit" label="Spending limit $" sample="80" wide />
        <FillLine name="s-guests" label="Guest count" sample="8" />
        <FillLine name="s-when" label="Date / time" sample="Sat 2–3:30pm" />
        <FillLine name="s-place" label="Place" sample="Backyard" />
        <ul className="mt-3 space-y-2">
          <FillCheck name="s-hosting" sampleChecked>
            Hosting
          </FillCheck>
          <FillCheck name="s-attending">Attending someone else&apos;s</FillCheck>
        </ul>
      </div>
      <div className="rounded-xl border-2 border-ink/30 p-4">
        <h2 className="font-display text-3xl">Max spend per kid</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <FillLine name="s-max-limit" label="Limit $" sample="80" />
          <FillLine name="s-max-kids" label="÷ kids" sample="8" />
          <FillLine name="s-max-each" label="= max each $" sample="10" wide />
        </div>
      </div>
      <div>
        <h2 className="font-display text-3xl">Spend lines</h2>
        <FillLine name="s-food" label="Food" sample="$28 snacks + juice" />
        <FillLine name="s-cake" label="Cake" sample="$18 grocery cupcakes" />
        <FillLine name="s-activity" label="Activity" sample="$0 obstacle course" />
        <FillLine name="s-invites" label="Invites" sample="$0 group text" />
        <FillLine name="s-bags" label="Gifts / bags" sample="$0 skip bags" />
        <FillLine name="s-spend-total" label="Total" sample="$46" />
      </div>
      <div>
        <h2 className="font-display text-3xl">Activity picked</h2>
        <ul className="mt-3 space-y-2">
          <FillCheck name="s-act-park">Park picnic + one game</FillCheck>
          <FillCheck name="s-act-yard" sampleChecked>
            Backyard obstacle course
          </FillCheck>
        </ul>
      </div>
    </div>
  );
}
