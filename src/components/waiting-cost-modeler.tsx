"use client";

import { useId, useState } from "react";
import {
  buildWaitingCostRows,
  clampWeeklyAmount,
  formatDollars,
} from "@/lib/waiting-cost";

/** Same ~10% ballpark as the article table. Illustration only. */
const ARTICLE_RETURN = 0.1;

export function WaitingCostModeler({
  defaultWeekly = 25,
}: {
  defaultWeekly?: number;
}) {
  const weeklyId = useId();
  const [weeklyInput, setWeeklyInput] = useState(String(defaultWeekly));
  const weekly = clampWeeklyAmount(Number(weeklyInput));
  const rows = buildWaitingCostRows(weekly, ARTICLE_RETURN);
  const now = rows[0];
  const wait5 = rows[2];
  const wait10 = rows[3];

  return (
    <aside
      className="my-10 rounded-2xl border border-rule bg-paper-2 px-5 py-6 sm:px-6"
      aria-labelledby={`${weeklyId}-heading`}
    >
      <h2
        id={`${weeklyId}-heading`}
        className="font-display text-2xl leading-snug"
      >
        Try a different weekly amount
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        Not advice. Same made-up ~10% picture as the article. Change $25 to
        whatever fits, and see the gap.
      </p>

      <label className="mt-5 flex max-w-xs flex-col gap-1.5" htmlFor={weeklyId}>
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
          Dollars per week
        </span>
        <div className="flex items-center gap-2 rounded-xl border border-rule bg-paper px-3 py-2">
          <span className="text-ink-soft" aria-hidden>
            $
          </span>
          <input
            id={weeklyId}
            type="number"
            inputMode="numeric"
            min={1}
            max={1000}
            step={1}
            value={weeklyInput}
            onChange={(event) => setWeeklyInput(event.target.value)}
            onBlur={() => setWeeklyInput(String(weekly))}
            className="w-full bg-transparent text-lg font-medium text-ink outline-none"
          />
        </div>
      </label>

      <ul className="mt-5 space-y-2 text-base leading-7 text-ink">
        <li>
          Start this week (30 years): about{" "}
          <strong>{formatDollars(now.nestEgg)}</strong>
        </li>
        <li>
          Wait 5 years: about <strong>{formatDollars(wait5.nestEgg)}</strong>{" "}
          <span className="text-ink-soft">
            (miss ~{formatDollars(wait5.missed)})
          </span>
        </li>
        <li>
          Wait 10 years: about <strong>{formatDollars(wait10.nestEgg)}</strong>{" "}
          <span className="text-ink-soft">
            (miss ~{formatDollars(wait10.missed)})
          </span>
        </li>
      </ul>
    </aside>
  );
}
