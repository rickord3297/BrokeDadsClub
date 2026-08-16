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
      className="inline-flex h-11 items-center rounded-full bg-pine px-5 text-sm font-semibold text-paper hover:bg-pine-2 print:hidden"
    >
      {label}
    </button>
  );
}
