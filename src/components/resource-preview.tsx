export function ResourcePreview({ slug }: { slug: string }) {
  return (
    <div
      className="aspect-[8.5/11] overflow-hidden rounded-lg border border-rule bg-white p-2.5 shadow-sm"
      aria-hidden
    >
      {slug === "grocery-week-checklist" ? <GroceryMini /> : null}
      {slug === "school-supply-triage" ? <SchoolMini /> : null}
      {slug === "birthday-party-budget" ? <BirthdayMini /> : null}
    </div>
  );
}

function Line({ children }: { children?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2 w-2 shrink-0 rounded-[1px] border border-ink/70" />
      <span className="h-1.5 flex-1 rounded-sm bg-ink/15" />
      {children ? (
        <span className="max-w-[55%] truncate text-[7px] leading-none text-ink/70">
          {children}
        </span>
      ) : null}
    </div>
  );
}

function GroceryMini() {
  return (
    <div className="flex h-full flex-col gap-1.5 text-[7px] leading-tight text-ink">
      <p className="font-stamp text-[8px] uppercase tracking-wider">Grocery week</p>
      <p className="font-display text-[10px] leading-tight">$47 cart · 3-4 people</p>
      <p className="mt-1 font-semibold">Protein · about $12</p>
      <Line>Dozen eggs</Line>
      <Line>Chicken thighs</Line>
      <p className="mt-1 font-semibold">Starch · about $8</p>
      <Line>Rice or potatoes</Line>
      <Line>Pasta</Line>
      <p className="mt-1 font-semibold">Produce · about $10</p>
      <Line>Onions + frozen veg</Line>
      <div className="mt-auto rounded border border-ink/20 p-1">
        <p className="font-semibold">Swap box</p>
        <p className="text-ink/60">Turkey or extra beans</p>
      </div>
    </div>
  );
}

function SchoolMini() {
  return (
    <div className="flex h-full flex-col gap-1.5 text-[7px] leading-tight text-ink">
      <p className="font-stamp text-[8px] uppercase tracking-wider">School supplies</p>
      <p className="font-display text-[10px] leading-tight">Already own, then triage</p>
      <Line>Backpack</Line>
      <Line>Scissors</Line>
      <Line>Binders</Line>
      <div className="mt-1 grid grid-cols-3 gap-1">
        {["Must", "Reuse", "Skip"].map((col) => (
          <div key={col} className="rounded border border-ink/20 p-1">
            <p className="font-semibold">{col}</p>
            <div className="mt-1 space-y-1">
              <span className="block h-1 rounded-sm bg-ink/15" />
              <span className="block h-1 rounded-sm bg-ink/15" />
              <span className="block h-1 rounded-sm bg-ink/15" />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-auto font-semibold">Store ______  Cap $ ______</p>
    </div>
  );
}

function BirthdayMini() {
  return (
    <div className="flex h-full flex-col gap-1.5 text-[7px] leading-tight text-ink">
      <p className="font-stamp text-[8px] uppercase tracking-wider">Birthday budget</p>
      <p className="font-display text-[10px] leading-tight">Limit ÷ kids = max each</p>
      <div className="grid grid-cols-3 gap-1 rounded border border-ink/20 p-1 text-center">
        <p>$ ____</p>
        <p>÷ ____</p>
        <p>= $ ____</p>
      </div>
      <Line>Food</Line>
      <Line>Cake</Line>
      <Line>Activity</Line>
      <div className="mt-auto rounded border border-ink/20 p-1">
        <p className="font-semibold">Free / low-cost</p>
        <p className="text-ink/60">Park pavilion · backyard games</p>
      </div>
    </div>
  );
}
