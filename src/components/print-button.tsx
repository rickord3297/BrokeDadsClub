"use client";

import { useEffect } from "react";
import { trackPrintablePrint } from "@/lib/analytics";

export function PrintButton({
  label = "Print this page",
  resourceSlug,
}: {
  label?: string;
  resourceSlug?: string;
}) {
  useEffect(() => {
    if (window.location.hash !== "#print") return;
    const timer = window.setTimeout(() => {
      if (resourceSlug) trackPrintablePrint(resourceSlug);
      window.print();
    }, 400);
    return () => window.clearTimeout(timer);
  }, [resourceSlug]);

  function print() {
    if (resourceSlug) trackPrintablePrint(resourceSlug);
    window.print();
  }

  return (
    <button
      id="print"
      type="button"
      onClick={print}
      className="inline-flex h-12 min-w-48 items-center justify-center rounded-full bg-pine px-6 text-base font-semibold text-paper hover:bg-pine-2 print:hidden"
    >
      {label}
    </button>
  );
}
