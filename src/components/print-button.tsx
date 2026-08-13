"use client";

export function PrintButton({ label = "Print checklist" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-11 items-center rounded-full bg-pine px-5 text-sm font-semibold text-paper hover:bg-pine-2 print:hidden"
    >
      {label}
    </button>
  );
}
