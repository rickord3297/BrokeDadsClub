"use client";

import { useEffect } from "react";
import {
  SheetModeProvider,
  SheetModeToggle,
  useLocalSheetMode,
} from "@/components/fillable-fields";
import { ResourceActionButtons } from "@/components/resource-actions";
import { ResourceSample } from "@/components/resource-sample";
import { trackPrintablePrint } from "@/lib/analytics";

export function ResourceSheetWorkspace({
  resourceSlug,
  printLabel,
  children,
}: {
  resourceSlug: string;
  printLabel: string;
  children: React.ReactNode;
}) {
  const [mode, setMode] = useLocalSheetMode("blank");

  useEffect(() => {
    if (window.location.hash !== "#print") return;
    const timer = window.setTimeout(() => {
      trackPrintablePrint(resourceSlug);
      window.print();
    }, 400);
    return () => window.clearTimeout(timer);
  }, [resourceSlug]);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between print:hidden">
        <SheetModeToggle mode={mode} onChange={setMode} />
        <ResourceActionButtons
          resourceSlug={resourceSlug}
          printLabel={printLabel}
          mode="page"
        />
      </div>
      <p className="mt-3 text-sm text-ink-soft print:hidden">
        Type on your phone before the store, or switch to the filled sample to
        see how another dad allocated the numbers. Print keeps what you typed.
      </p>

      <SheetModeProvider mode={mode}>
        <section className="print-sheet mt-8">
          {mode === "sample" ? (
            <ResourceSample slug={resourceSlug} />
          ) : (
            children
          )}
        </section>
      </SheetModeProvider>

      <div className="mt-8 flex flex-col gap-3 border-t border-rule pt-6 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <ResourceActionButtons
          resourceSlug={resourceSlug}
          printLabel={printLabel}
          mode="page"
        />
        <p className="text-sm text-ink-soft">
          Tip: on mobile, tap Download PDF, then choose Save as PDF.
        </p>
      </div>
    </div>
  );
}
