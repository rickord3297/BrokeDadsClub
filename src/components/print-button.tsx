"use client";

import { useEffect } from "react";
import { trackPrintablePrint } from "@/lib/analytics";

const defaultClassName =
  "inline-flex h-12 min-w-48 items-center justify-center rounded-full bg-pine px-6 text-base font-semibold text-paper hover:bg-pine-2 print:hidden";

export function PrintButton({
  label = "Print this page",
  resourceSlug,
  mode = "page",
  className = defaultClassName,
}: {
  label?: string;
  resourceSlug?: string;
  /** "page" prints the current document; "resource" opens a print-ready window */
  mode?: "page" | "resource";
  className?: string;
}) {
  useEffect(() => {
    if (mode !== "page" || window.location.hash !== "#print") return;
    const timer = window.setTimeout(() => {
      if (resourceSlug) trackPrintablePrint(resourceSlug);
      window.print();
    }, 400);
    return () => window.clearTimeout(timer);
  }, [resourceSlug, mode]);

  function print() {
    if (resourceSlug) trackPrintablePrint(resourceSlug);
    if (mode === "resource" && resourceSlug) {
      window.open(
        `/resources/${resourceSlug}#print`,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }
    window.print();
  }

  return (
    <button
      id={mode === "page" ? "print" : undefined}
      type="button"
      onClick={print}
      className={className}
    >
      {label}
    </button>
  );
}
