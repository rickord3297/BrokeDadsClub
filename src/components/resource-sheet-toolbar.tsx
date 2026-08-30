"use client";

import { ResourceActionButtons } from "@/components/resource-actions";
import { SheetModeToggle, type SheetMode } from "@/components/fillable-fields";

/** Single sticky control row above the interactive printable sheet. */
export function ResourceSheetToolbar({
  resourceSlug,
  printLabel,
  mode,
  onModeChange,
}: {
  resourceSlug: string;
  printLabel: string;
  mode: SheetMode;
  onModeChange: (mode: SheetMode) => void;
}) {
  return (
    <div className="sticky top-16 z-20 -mx-4 border-b border-rule/80 bg-paper/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 print:hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <SheetModeToggle mode={mode} onChange={onModeChange} />
        <ResourceActionButtons
          resourceSlug={resourceSlug}
          printLabel={printLabel}
          mode="page"
          size="compact"
        />
      </div>
      <p className="mt-2 text-xs leading-5 text-ink-soft sm:text-sm sm:leading-6">
        Type on your phone before the store, or open the filled sample to see how
        another dad ran the numbers. Print keeps what you typed.
      </p>
    </div>
  );
}
