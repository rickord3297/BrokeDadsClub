"use client";

import { useId, useState } from "react";
import {
  buildWaitingCostRows,
  clampWeeklyAmount,
  formatDollars,
} from "@/lib/waiting-cost";

const RETURN_OPTIONS = [
  { value: 0.1, label: "~10% / year" },
  { value: 0.08, label: "~8% / year" },
] as const;

export function WaitingCostModeler({
  defaultWeekly = 25,
}: {
  defaultWeekly?: number;
}) {
  const weeklyId = useId();
  const returnId = useId();
  const [weeklyInput, setWeeklyInput] = useState(String(defaultWeekly));
  const [annualReturn, setAnnualReturn] = useState<number>(0.1);

  const weekly = clampWeeklyAmount(Number(weeklyInput));
  const rows = buildWaitingCostRows(weekly, annualReturn);
  const baseline = rows[0];

  return (
    <aside
      className="my-10 rounded-2xl border border-rule bg-paper-2 px-5 py-6 sm:px-6"
      aria-labelledby={`${weeklyId}-heading`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-pine">
        Try your weekly amount
      </p>
      <h2
        id={`${weeklyId}-heading`}
        className="mt-2 font-display text-2xl leading-snug"
      >
        Waiting-cost modeler
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink-soft">
        Not financial advice or guidance. Same made-up illustration as the
        article: weekly deposits into a broad total-market return assumption for
        30 years. Change the number and see how delay reshapes the pile.
      </p>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="flex min-w-0 flex-1 flex-col gap-1.5" htmlFor={weeklyId}>
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

        <label className="flex min-w-0 flex-1 flex-col gap-1.5" htmlFor={returnId}>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
            Return assumption
          </span>
          <select
            id={returnId}
            value={annualReturn}
            onChange={(event) => setAnnualReturn(Number(event.target.value))}
            className="rounded-xl border border-rule bg-paper px-3 py-2.5 text-base text-ink outline-none"
          >
            {RETURN_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-3 text-sm text-ink-soft">
        Modeling{" "}
        <span className="font-medium text-ink">{formatDollars(weekly)}</span> a
        week. If you started this week for 30 years: about{" "}
        <span className="font-medium text-ink">
          {formatDollars(baseline.nestEgg)}
        </span>{" "}
        on {formatDollars(baseline.deposits)} of deposits.
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-rule text-xs uppercase tracking-[0.12em] text-ink-soft">
              <th className="py-2 pr-3 font-bold">When you start</th>
              <th className="py-2 pr-3 font-bold">Years in</th>
              <th className="py-2 pr-3 font-bold">Deposits</th>
              <th className="py-2 pr-3 font-bold">Nest egg</th>
              <th className="py-2 font-bold">You miss</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-rule/70">
                <td className="py-2.5 pr-3 font-medium text-ink">{row.label}</td>
                <td className="py-2.5 pr-3 text-ink-soft">{row.years}</td>
                <td className="py-2.5 pr-3 text-ink-soft">
                  {formatDollars(row.deposits)}
                </td>
                <td className="py-2.5 pr-3 text-ink">
                  {formatDollars(row.nestEgg)}
                </td>
                <td className="py-2.5 text-ink">
                  {row.missed === 0 ? "baseline" : formatDollars(row.missed)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-5 text-ink-soft">
        Past returns are not a promise. Fees, taxes, and real life will change
        these numbers. This is a representation of waiting, not a plan for your
        household.
      </p>
    </aside>
  );
}
