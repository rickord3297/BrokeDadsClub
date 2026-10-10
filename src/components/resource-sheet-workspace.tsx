"use client";

import { useEffect } from "react";
import {
  SheetModeProvider,
  useLocalSheetMode,
} from "@/components/fillable-fields";
import { ResourceSheetToolbar } from "@/components/resource-sheet-toolbar";
import { ResourceSample } from "@/components/resource-sample";
import { trackPrintablePrint } from "@/lib/analytics";

/**
 * custom: swap in the hand-built example from resource-sample.
 * inline: the sheet's own fields carry sample values.
 * none: no filled example, so the toggle is hidden.
 */
export type ResourceSampleMode = "custom" | "inline" | "none";

export function ResourceSheetWorkspace({
  resourceSlug,
  printLabel,
  sampleMode,
  children,
}: {
  resourceSlug: string;
  printLabel: string;
  sampleMode: ResourceSampleMode;
  children: React.ReactNode;
}) {
  const [selectedMode, setMode] = useLocalSheetMode("blank");
  const mode = sampleMode === "none" ? "blank" : selectedMode;

  useEffect(() => {
    if (window.location.hash !== "#print") return;
    const timer = window.setTimeout(() => {
      trackPrintablePrint(resourceSlug);
      window.print();
    }, 400);
    return () => window.clearTimeout(timer);
  }, [resourceSlug]);

  return (
    <div className="mt-8 print:mt-0">
      <ResourceSheetToolbar
        resourceSlug={resourceSlug}
        printLabel={printLabel}
        mode={mode}
        onModeChange={setMode}
        showSampleToggle={sampleMode !== "none"}
      />

      <SheetModeProvider mode={mode}>
        <section className="print-sheet mt-6 rounded-2xl border border-rule bg-white p-5 shadow-sm shadow-ink/5 sm:p-8 print:mt-0 print:rounded-none print:border-0 print:p-0 print:shadow-none">
          {mode === "sample" && sampleMode === "custom" ? (
            <ResourceSample slug={resourceSlug} />
          ) : (
            children
          )}
        </section>
      </SheetModeProvider>

      <p className="mt-4 text-center text-xs text-ink-soft print:hidden sm:text-sm">
        Tip: on mobile, tap Download PDF, then choose Save as PDF.
      </p>
    </div>
  );
}
