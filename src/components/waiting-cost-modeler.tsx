"use client";

import { useId, useState } from "react";
import {
  buildWaitingCostRows,
  clampWeeklyAmount,
  formatDollars,
} from "@/lib/waiting-cost";

/** Same ~10% ballpark as the article table. Illustration only. */
const ARTICLE_RETURN = 0.1;
const PRESETS = [25, 35, 50] as const;

export function WaitingCostModeler({
  defaultWeekly = 25,
}: {
  defaultWeekly?: number;
}) {
  const weeklyId = useId();
  const [weekly, setWeekly] = useState(defaultWeekly);
  const rows = buildWaitingCostRows(weekly, ARTICLE_RETURN);
  const now = rows[0];
  const wait5 = rows[2];
  const wait10 = rows[3];

  return (
    <aside
      data-waiting-cost-modeler
      className="my-10 scroll-mt-28 rounded-2xl border border-rule bg-paper-2 px-5 py-6 sm:px-6"
      aria-labelledby={`${weeklyId}-heading`}
    >
      <h2
        id={`${weeklyId}-heading`}
        className="font-display text-2xl leading-snug"
      >
        Try a different weekly amount
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        Not advice. Same made-up ~10% picture as the article. Pick an amount
        and see the gap.
      </p>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Weekly amount">
        {PRESETS.map((amount) => {
          const selected = weekly === amount;
          return (
            <button
              key={amount}
              type="button"
              onClick={() => setWeekly(amount)}
              aria-pressed={selected}
              className={`rounded-xl border px-4 py-2 text-base font-medium transition-colors ${
                selected
                  ? "border-pine bg-pine text-paper"
                  : "border-rule bg-paper text-ink hover:border-pine"
              }`}
            >
              ${amount}/week
            </button>
          );
        })}
      </div>

      <label className="mt-4 flex max-w-xs flex-col gap-1.5" htmlFor={weeklyId}>
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
          Or type your own
        </span>
        <div className="flex items-center gap-2 rounded-xl border border-rule bg-paper px-3 py-2">
          <span className="text-ink-soft" aria-hidden>
            $
          </span>
          <input
            id={weeklyId}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={String(weekly)}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "");
              if (digits === "") {
                setWeekly(1);
                return;
              }
              setWeekly(clampWeeklyAmount(Number(digits)));
            }}
            className="w-full bg-transparent text-lg font-medium text-ink outline-none"
          />
          <span className="shrink-0 text-sm text-ink-soft">/ week</span>
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
