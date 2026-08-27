"use client";

import { trackPrintablePrint } from "@/lib/analytics";

function PdfIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <path
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-5-6Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v6h6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 13.5h7M8.5 17h5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PrinterIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <path
        d="M7 8V4h10v4M7 16H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M7 13h10v7H7v-7Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ResourceActionButtons({
  resourceSlug,
  printLabel = "Print",
  mode = "resource",
  size = "default",
}: {
  resourceSlug: string;
  printLabel?: string;
  /** "page" prints the current sheet (keeps typed values). "resource" opens the tool. */
  mode?: "page" | "resource";
  size?: "default" | "compact";
}) {
  const printCls =
    size === "compact"
      ? "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-pine px-4 text-sm font-semibold text-paper transition hover:bg-pine-2"
      : "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-pine px-5 text-sm font-semibold text-paper transition hover:bg-pine-2";
  const pdfCls =
    size === "compact"
      ? "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-ink bg-paper px-4 text-sm font-semibold text-ink transition hover:bg-ink hover:text-paper"
      : "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-ink bg-paper px-5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-paper";

  function run(kind: "print" | "pdf") {
    trackPrintablePrint(resourceSlug);
    if (mode === "page") {
      window.print();
      return;
    }
    window.open(
      `/resources/${resourceSlug}#print`,
      "_blank",
      "noopener,noreferrer",
    );
    void kind;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <button
        id={mode === "page" ? "print" : undefined}
        type="button"
        onClick={() => run("print")}
        className={printCls}
      >
        <PrinterIcon />
        {printLabel}
      </button>
      <button
        type="button"
        onClick={() => run("pdf")}
        className={pdfCls}
        title="Save as PDF from the print dialog"
        aria-label="Download PDF"
      >
        <PdfIcon />
        Download PDF
      </button>
    </div>
  );
}
