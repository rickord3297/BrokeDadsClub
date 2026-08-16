"use client";

import { useEffect } from "react";

export function PrintButton({ label = "Print this page" }: { label?: string }) {
  useEffect(() => {
    if (window.location.hash !== "#print") return;
    const timer = window.setTimeout(() => window.print(), 400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <button
      id="print"
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-12 min-w-48 items-center justify-center rounded-full bg-pine px-6 text-base font-semibold text-paper hover:bg-pine-2 print:hidden"
    >
      {label}
    </button>
  );
}
