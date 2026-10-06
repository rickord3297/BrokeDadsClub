"use client";

import { useEffect, useMemo, useState } from "react";
import { persistStorageKey, usePersistSheetSlug } from "@/components/persist-sheet";
import { useSheetMode } from "@/components/fillable-fields";

type Row = {
  name: string;
  monthly: string;
  cutToday: boolean;
};

const DEFAULT_ROWS: Row[] = Array.from({ length: 8 }, () => ({
  name: "",
  monthly: "",
  cutToday: false,
}));

const SAMPLE_ROWS: Row[] = [
  { name: "Streaming bundle", monthly: "22.99", cutToday: false },
  { name: "Kids game app", monthly: "7.99", cutToday: true },
  { name: "Cloud storage", monthly: "2.99", cutToday: false },
  { name: "Gym (unused)", monthly: "39.00", cutToday: true },
  { name: "", monthly: "", cutToday: false },
  { name: "", monthly: "", cutToday: false },
  { name: "", monthly: "", cutToday: false },
  { name: "", monthly: "", cutToday: false },
];

function parseMoney(value: string) {
  const n = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function SubscriptionBurnSheet() {
  const mode = useSheetMode();
  const slug = usePersistSheetSlug();
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);

  useEffect(() => {
    if (mode === "sample") {
      setRows(SAMPLE_ROWS);
      return;
    }
    if (!slug) return;
    try {
      const raw = localStorage.getItem(persistStorageKey(slug, "rows"));
      if (raw) setRows(JSON.parse(raw) as Row[]);
    } catch {
      /* ignore */
    }
  }, [mode, slug]);

  const persist = (next: Row[]) => {
    setRows(next);
    if (!slug || mode === "sample") return;
    try {
      localStorage.setItem(persistStorageKey(slug, "rows"), JSON.stringify(next));
    } catch {
      /* quota */
    }
  };

  const totals = useMemo(() => {
    let monthly = 0;
    let cutMonthly = 0;
    for (const row of rows) {
      const m = parseMoney(row.monthly);
      monthly += m;
      if (row.cutToday) cutMonthly += m;
    }
    return {
      monthly,
      annual: monthly * 12,
      afterCut: monthly - cutMonthly,
      annualAfterCut: (monthly - cutMonthly) * 12,
    };
  }, [rows]);

  const readOnly = mode === "sample";

  return (
    <div className="space-y-8 print:space-y-4">
      <p className="text-base leading-7 text-ink-soft">
        List every auto-renew. The annual column is the number that hurts enough
        to cancel one thing today.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-ink/30 text-left print:border-black">
              <th className="py-2 pr-2">Subscription</th>
              <th className="py-2 pr-2 w-28">$/month</th>
              <th className="py-2 w-24">Cut today?</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-ink/15 print:border-black/30">
                <td className="py-2 pr-2">
                  <input
                    value={row.name}
                    readOnly={readOnly}
                    placeholder="Service name"
                    onChange={(e) => {
                      const next = [...rows];
                      next[index] = { ...row, name: e.target.value };
                      persist(next);
                    }}
                    className="w-full border-0 bg-transparent text-base outline-none placeholder:text-ink-soft/50"
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    value={row.monthly}
                    readOnly={readOnly}
                    placeholder="0.00"
                    inputMode="decimal"
                    onChange={(e) => {
                      const next = [...rows];
                      next[index] = { ...row, monthly: e.target.value };
                      persist(next);
                    }}
                    className="w-full border-0 bg-transparent text-base outline-none placeholder:text-ink-soft/50"
                  />
                </td>
                <td className="py-2">
                  <input
                    type="checkbox"
                    checked={row.cutToday}
                    disabled={readOnly}
                    onChange={(e) => {
                      const next = [...rows];
                      next[index] = { ...row, cutToday: e.target.checked };
                      persist(next);
                    }}
                    className="h-5 w-5 accent-pine"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border-2 border-ink/25 p-4 print:border-black">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Current burn
          </p>
          <p className="mt-2 font-display text-3xl">${totals.monthly.toFixed(2)}/mo</p>
          <p className="text-sm text-ink-soft">${totals.annual.toFixed(2)}/year</p>
        </div>
        <div className="rounded-xl border-2 border-pine/40 bg-pine/[0.06] p-4 print:border-black">
          <p className="text-xs font-semibold uppercase tracking-wider text-pine">
            After cuts checked
          </p>
          <p className="mt-2 font-display text-3xl">${totals.afterCut.toFixed(2)}/mo</p>
          <p className="text-sm text-ink-soft">${totals.annualAfterCut.toFixed(2)}/year</p>
        </div>
      </div>
    </div>
  );
}
