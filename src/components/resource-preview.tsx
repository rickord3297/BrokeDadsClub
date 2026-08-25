export function ResourcePreview({
  slug,
  variant = "sheet",
}: {
  slug: string;
  variant?: "sheet" | "fridge" | "card";
}) {
  if (variant === "card") {
    return (
      <div
        className="overflow-hidden rounded-lg border border-rule bg-white shadow-[0_12px_40px_-12px_rgba(28,25,21,0.18)]"
        aria-hidden
      >
        {slug === "grocery-week-checklist" ? <GroceryCardPreview /> : null}
        {slug === "school-supply-triage" ? <SchoolCardPreview /> : null}
        {slug === "birthday-party-budget" ? <BirthdayCardPreview /> : null}
      </div>
    );
  }

  const sheet = (
    <div
      className="aspect-[8.5/11] overflow-hidden rounded-lg border border-rule bg-white p-2.5 shadow-sm"
      aria-hidden
    >
      {slug === "grocery-week-checklist" ? <GroceryMini /> : null}
      {slug === "school-supply-triage" ? <SchoolMini /> : null}
      {slug === "birthday-party-budget" ? <BirthdayMini /> : null}
    </div>
  );

  if (variant === "fridge") {
    return (
      <div
        className="relative overflow-hidden rounded-xl bg-gradient-to-b from-slate-300/90 to-slate-400/80 p-4 pt-10 shadow-inner"
        aria-hidden
      >
        <div className="absolute left-0 top-0 h-full w-1 bg-white/40" />
        <div className="absolute right-3 top-6 h-10 w-1.5 rounded-full bg-slate-500/50" />
        <div className="absolute left-4 top-3 text-[9px] font-semibold uppercase tracking-wider text-slate-600/80">
          Fridge
        </div>
        <div className="relative mx-auto max-w-[88%] rotate-[-1.5deg]">
          <div className="absolute -top-1.5 left-1/2 z-10 h-2.5 w-5 -translate-x-1/2 rounded-sm bg-rust shadow-sm" />
          <div className="shadow-lg shadow-ink/20">{sheet}</div>
        </div>
      </div>
    );
  }

  return sheet;
}

function CheckSvg() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" aria-hidden>
      <rect
        x="1.5"
        y="1.5"
        width="13"
        height="13"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function GroceryCardPreview() {
  return (
    <div className="aspect-[4/5] bg-white p-6 text-ink sm:p-8">
      <div className="flex items-start justify-between gap-4 border-b-2 border-ink pb-4">
        <div>
          <p className="font-stamp text-[10px] uppercase tracking-[0.22em] text-pine">
            Broke Dads Club
          </p>
          <h3 className="mt-2 font-display text-2xl leading-tight">
            Grocery week
          </h3>
          <p className="mt-1 text-sm text-ink-soft">$47 cart · 3–4 people</p>
        </div>
        <div className="rounded-md border border-ink px-2 py-1 text-[10px] font-semibold uppercase tracking-wider">
          Print
        </div>
      </div>
      <div className="mt-5 space-y-4 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
            Protein · $12
          </p>
          <ul className="mt-2 space-y-2">
            {["Dozen eggs", "Chicken thighs", "Canned beans"].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <CheckSvg />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
            Starch · $8
          </p>
          <ul className="mt-2 space-y-2">
            {["Rice or potatoes", "Pasta"].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <CheckSvg />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-ink/20 bg-paper-2/40 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em]">
            Swap box
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Turkey or extra beans if chicken is up
          </p>
        </div>
      </div>
    </div>
  );
}

function SchoolCardPreview() {
  return (
    <div className="aspect-[4/5] bg-white p-6 text-ink sm:p-8">
      <p className="font-stamp text-[10px] uppercase tracking-[0.22em] text-pine">
        Broke Dads Club
      </p>
      <h3 className="mt-2 font-display text-2xl leading-tight">
        School supply triage
      </h3>
      <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
        {["Must buy", "Reuse", "Skip"].map((col) => (
          <div key={col} className="rounded-md border border-ink/20 p-2">
            <p className="font-semibold">{col}</p>
            <div className="mt-2 space-y-1.5">
              <span className="block h-1 rounded bg-ink/15" />
              <span className="block h-1 rounded bg-ink/15" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BirthdayCardPreview() {
  return (
    <div className="aspect-[4/5] bg-white p-6 text-ink sm:p-8">
      <p className="font-stamp text-[10px] uppercase tracking-[0.22em] text-pine">
        Broke Dads Club
      </p>
      <h3 className="mt-2 font-display text-2xl leading-tight">
        Birthday party budget
      </h3>
      <div className="mt-5 grid grid-cols-3 gap-2 rounded-md border border-ink/20 p-3 text-center text-sm">
        <div>
          <p className="text-xs text-ink-soft">Limit</p>
          <p className="mt-1 font-display text-xl">$___</p>
        </div>
        <div>
          <p className="text-xs text-ink-soft">Kids</p>
          <p className="mt-1 font-display text-xl">___</p>
        </div>
        <div>
          <p className="text-xs text-ink-soft">Each</p>
          <p className="mt-1 font-display text-xl">$___</p>
        </div>
      </div>
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
