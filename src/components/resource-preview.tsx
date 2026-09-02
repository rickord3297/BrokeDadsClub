function PaperClipIcon() {
  return (
    <svg
      viewBox="0 0 24 32"
      className="absolute -right-0.5 top-2 z-10 h-5 w-3.5 text-ink/35 drop-shadow-sm"
      aria-hidden
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        d="M16 4v16a4 4 0 1 1-8 0V6a2 2 0 1 1 4 0v14a2 2 0 0 1-4 0V8"
      />
    </svg>
  );
}

function CornerFold() {
  return (
    <div
      className="pointer-events-none absolute right-0 bottom-0 h-6 w-6"
      aria-hidden
    >
      <div className="absolute right-0 bottom-0 h-0 w-0 border-b-[1.5rem] border-l-[1.5rem] border-b-paper-2 border-l-transparent" />
      <div className="absolute right-0 bottom-0 h-0 w-0 border-b-[1.4rem] border-l-[1.4rem] border-b-ink/10 border-l-transparent" />
    </div>
  );
}

export function ResourcePreview({
  slug,
  variant = "sheet",
}: {
  slug: string;
  variant?: "sheet" | "fridge" | "card";
}) {
  if (variant === "card") {
    return (
      <div className="relative mx-auto w-full max-w-[7.5rem] sm:max-w-[8.5rem] lg:mx-0 lg:max-w-[9.5rem]">
        <PaperClipIcon />
        <div
          className="relative overflow-hidden rounded-sm border border-ink/12 bg-white shadow-[0_2px_8px_rgba(28,25,21,0.06),0_12px_32px_-8px_rgba(28,25,21,0.18)]"
          aria-hidden
        >
          {slug === "grocery-week-checklist" ? <GroceryCardPreview /> : null}
          {slug === "school-supply-triage" ? <SchoolCardPreview /> : null}
          {slug === "birthday-party-budget" ? <BirthdayCardPreview /> : null}
          <CornerFold />
        </div>
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

function CardCheckSvg() {
  return (
    <svg viewBox="0 0 16 16" className="h-2.5 w-2.5 shrink-0" aria-hidden>
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
    <div className="aspect-[3/4] bg-white p-2.5 text-ink sm:p-3">
      <div className="flex items-start justify-between gap-2 border-b border-ink pb-2">
        <div>
          <p className="font-stamp text-[6px] uppercase tracking-[0.18em] text-pine">
            Broke Dads Club
          </p>
          <h3 className="mt-1 font-display text-sm leading-tight">Grocery week</h3>
          <p className="mt-0.5 text-[9px] leading-tight text-ink-soft">
            $47 · 3–4 people
          </p>
        </div>
        <div className="rounded border border-ink px-1 py-px text-[6px] font-semibold uppercase tracking-wide">
          Print
        </div>
      </div>
      <div className="mt-2 space-y-2 text-[9px] leading-tight">
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
            Protein · $12
          </p>
          <ul className="mt-1 space-y-1">
            {["Dozen eggs", "Chicken thighs"].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CardCheckSvg />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
            Starch · $8
          </p>
          <ul className="mt-1 space-y-1">
            <li className="flex items-center gap-1.5">
              <CardCheckSvg />
              <span>Rice or potatoes</span>
            </li>
          </ul>
        </div>
        <div className="rounded border border-ink/20 bg-paper-2/40 p-1.5">
          <p className="text-[8px] font-semibold uppercase tracking-[0.1em]">
            Swap box
          </p>
        </div>
      </div>
    </div>
  );
}

function SchoolCardPreview() {
  return (
    <div className="aspect-[3/4] bg-white p-2.5 text-ink sm:p-3">
      <p className="font-stamp text-[6px] uppercase tracking-[0.18em] text-pine">
        Broke Dads Club
      </p>
      <h3 className="mt-1 font-display text-sm leading-tight">School supply triage</h3>
      <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[8px]">
        {["Must buy", "Reuse", "Skip"].map((col) => (
          <div key={col} className="rounded border border-ink/20 p-1">
            <p className="font-semibold leading-tight">{col}</p>
            <div className="mt-1 space-y-1">
              <span className="block h-0.5 rounded bg-ink/15" />
              <span className="block h-0.5 rounded bg-ink/15" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BirthdayCardPreview() {
  return (
    <div className="aspect-[3/4] bg-white p-2.5 text-ink sm:p-3">
      <p className="font-stamp text-[6px] uppercase tracking-[0.18em] text-pine">
        Broke Dads Club
      </p>
      <h3 className="mt-1 font-display text-sm leading-tight">Birthday party budget</h3>
      <div className="mt-2 grid grid-cols-3 gap-1 rounded border border-ink/20 p-1.5 text-center text-[9px]">
        <div>
          <p className="text-[8px] text-ink-soft">Limit</p>
          <p className="mt-0.5 font-display text-sm">$___</p>
        </div>
        <div>
          <p className="text-[8px] text-ink-soft">Kids</p>
          <p className="mt-0.5 font-display text-sm">___</p>
        </div>
        <div>
          <p className="text-[8px] text-ink-soft">Each</p>
          <p className="mt-0.5 font-display text-sm">$___</p>
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
