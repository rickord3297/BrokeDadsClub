"use client";

import { useEffect, useMemo, useState } from "react";
import { FillLine, useSheetMode } from "@/components/fillable-fields";
import { persistStorageKey, usePersistSheetSlug } from "@/components/persist-sheet";

type LineItem = { key: string; label: string; sample: string };

const LINE_ITEMS: LineItem[] = [
  { key: "reg", label: "Registration / league fee", sample: "185" },
  { key: "uniform", label: "Uniform / team gear", sample: "65" },
  { key: "gear", label: "Cleats, pads, upgrades", sample: "90" },
  { key: "travel", label: "Travel / gas / hotels", sample: "120" },
  { key: "concessions", label: "Snacks / concessions / team gifts", sample: "40" },
  { key: "misc", label: "Photos, fundraiser, misc", sample: "35" },
];

function parseMoney(value: string) {
  const n = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function YouthSportsTrueCostSheet() {
  const mode = useSheetMode();
  const slug = usePersistSheetSlug();
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === "sample") {
      setAmounts(
        Object.fromEntries(LINE_ITEMS.map((item) => [item.key, item.sample])),
      );
      return;
    }
    if (!slug) return;
    try {
      const raw = localStorage.getItem(persistStorageKey(slug, "sport-amounts"));
      if (raw) setAmounts(JSON.parse(raw) as Record<string, string>);
    } catch {
      /* ignore */
    }
  }, [mode, slug]);

  const setAmount = (key: string, value: string) => {
    const next = { ...amounts, [key]: value };
    setAmounts(next);
    if (!slug || mode === "sample") return;
    try {
      localStorage.setItem(persistStorageKey(slug, "sport-amounts"), JSON.stringify(next));
    } catch {
      /* quota */
    }
  };

  const total = useMemo(
    () => LINE_ITEMS.reduce((sum, item) => sum + parseMoney(amounts[item.key] ?? ""), 0),
    [amounts],
  );

  const readOnly = mode === "sample";

  return (
    <div className="space-y-8 print:space-y-4">
      <p className="text-base leading-7 text-ink-soft">
        Fill every line before you say yes to spring ball. Registration is the
        teaser rate.
      </p>
      <FillLine name="sport-season" label="Sport / season" placeholder="Fall soccer 2026" wide />
      <FillLine name="kid-name" label="Athlete" />

      <div className="space-y-0">
        {LINE_ITEMS.map((item) => (
          <div
            key={item.key}
            className="flex min-h-11 items-end gap-3 border-b-2 border-ink/25 py-2 print:border-black/40"
          >
            <span className="w-36 shrink-0 text-sm font-medium text-ink sm:w-48">
              {item.label}
            </span>
            <input
              value={readOnly ? item.sample : (amounts[item.key] ?? "")}
              readOnly={readOnly}
              placeholder="0"
              inputMode="decimal"
              onChange={(e) => setAmount(item.key, e.target.value)}
              className="min-h-7 min-w-0 flex-1 border-0 bg-transparent text-base text-ink outline-none placeholder:text-ink-soft/50 print:text-black"
            />
          </div>
        ))}
      </div>

      <div className="rounded-xl border-2 border-ink/30 p-4 print:border-black">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
          True seasonal tab
        </p>
        <p className="mt-2 font-display text-4xl">${total.toFixed(2)}</p>
        <p className="mt-2 text-sm text-ink-soft">
          Compare to your monthly grocery or daycare line. Still worth it?
        </p>
      </div>
    </div>
  );
}
