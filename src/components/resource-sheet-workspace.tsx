"use client";

import { useEffect } from "react";
import {
  SheetModeProvider,
  useLocalSheetMode,
} from "@/components/fillable-fields";
import { ResourceSheetToolbar } from "@/components/resource-sheet-toolbar";
import { PersistSheetProvider } from "@/components/persist-sheet";
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
    <div className="mt-8 print:mt-0">
      <ResourceSheetToolbar
        resourceSlug={resourceSlug}
        printLabel={printLabel}
        mode={mode}
        onModeChange={setMode}
      />

      <PersistSheetProvider slug={resourceSlug}>
        <SheetModeProvider mode={mode}>
          <section className="print-sheet mt-6 rounded-2xl border border-rule bg-white p-5 shadow-sm shadow-ink/5 sm:p-8 print:mt-0 print:rounded-none print:border-0 print:p-0 print:shadow-none">
            {mode === "sample" ? (
              <ResourceSample slug={resourceSlug} />
            ) : (
              children
            )}
          </section>
        </SheetModeProvider>
      </PersistSheetProvider>

      <p className="mt-4 text-center text-xs text-ink-soft print:hidden sm:text-sm">
        Tip: fields save on this device automatically. Print or Save as PDF when
        ready.
      </p>
    </div>
  );
}
