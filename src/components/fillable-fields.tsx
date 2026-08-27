"use client";

import { createContext, useContext, useId, useState } from "react";

type SheetMode = "blank" | "sample";

const SheetModeContext = createContext<SheetMode>("blank");

export function useSheetMode() {
  return useContext(SheetModeContext);
}

export function SheetModeProvider({
  mode,
  children,
}: {
  mode: SheetMode;
  children: React.ReactNode;
}) {
  return (
    <SheetModeContext.Provider value={mode}>
      {children}
    </SheetModeContext.Provider>
  );
}

export function SheetModeToggle({
  mode,
  onChange,
}: {
  mode: SheetMode;
  onChange: (mode: SheetMode) => void;
}) {
  return (
    <div
      className="inline-flex rounded-lg border border-rule bg-paper p-1 print:hidden"
      role="group"
      aria-label="Blank sheet or filled sample"
    >
      {(
        [
          { value: "blank", label: "Blank sheet" },
          { value: "sample", label: "Filled sample" },
        ] as const
      ).map((option) => {
        const selected = mode === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={
              selected
                ? "rounded-md bg-ink px-3 py-1.5 text-sm font-semibold text-paper"
                : "rounded-md px-3 py-1.5 text-sm font-medium text-ink-soft hover:text-ink"
            }
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function FillLine({
  label,
  name,
  wide = false,
  sample = "",
  placeholder = "",
}: {
  label?: string;
  name: string;
  wide?: boolean;
  sample?: string;
  placeholder?: string;
}) {
  const mode = useSheetMode();
  const id = useId();
  const [value, setValue] = useState("");
  const display = mode === "sample" ? sample : value;
  const readOnly = mode === "sample";

  return (
    <div className="flex min-h-11 items-end gap-3 border-b-2 border-ink/25 py-2 print:border-black/40">
      {label ? (
        <label
          htmlFor={id}
          className={`shrink-0 text-sm font-medium text-ink ${wide ? "w-36" : "w-32"}`}
        >
          {label}
        </label>
      ) : (
        <label htmlFor={id} className="sr-only">
          {name}
        </label>
      )}
      <input
        id={id}
        name={name}
        value={display}
        readOnly={readOnly}
        placeholder={mode === "blank" ? placeholder : undefined}
        onChange={(event) => setValue(event.target.value)}
        className={`min-h-7 min-w-0 flex-1 border-0 bg-transparent text-base text-ink outline-none placeholder:text-ink-soft/50 print:text-black ${
          readOnly ? "text-ink" : ""
        }`}
      />
    </div>
  );
}

export function FillCheck({
  name,
  children,
  sampleChecked = false,
}: {
  name: string;
  children: React.ReactNode;
  sampleChecked?: boolean;
}) {
  const mode = useSheetMode();
  const id = useId();
  const [checked, setChecked] = useState(false);
  const isChecked = mode === "sample" ? sampleChecked : checked;

  return (
    <li className="flex items-start gap-3 text-base leading-7">
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={isChecked}
        disabled={mode === "sample"}
        onChange={(event) => setChecked(event.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 rounded-[3px] border-2 border-ink accent-pine print:border-black"
      />
      <label htmlFor={id} className="min-w-0 flex-1">
        {children}
      </label>
    </li>
  );
}

export function useLocalSheetMode(initial: SheetMode = "blank") {
  return useState<SheetMode>(initial);
}
