"use client";

import { useEffect, useId, useRef, useState } from "react";
import { TEE_SIZE_CHART } from "@/lib/product-display";

export function SizeGuideLink({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`text-sm font-medium text-pine underline decoration-pine/30 underline-offset-2 hover:text-rust ${className}`}
      >
        Size guide
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-md rounded-2xl border border-rule bg-paper p-5 shadow-xl shadow-ink/20"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id={titleId} className="font-display text-2xl">
                  Tee size guide
                </h2>
                <p className="mt-1 text-sm text-ink-soft">
                  Softstyle unisex fit. Chest is circumference in inches. When in
                  doubt, size up.
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-rule px-3 py-1 text-sm text-ink-soft hover:border-ink hover:text-ink"
              >
                Close
              </button>
            </div>
            <table className="mt-5 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-rule text-ink-soft">
                  <th className="py-2 font-medium">Size</th>
                  <th className="py-2 font-medium">Chest</th>
                  <th className="py-2 font-medium">Length</th>
                </tr>
              </thead>
              <tbody>
                {TEE_SIZE_CHART.map((row) => (
                  <tr key={row.size} className="border-b border-rule/70">
                    <td className="py-2 font-semibold">{row.size}</td>
                    <td className="py-2">{row.chest}&quot;</td>
                    <td className="py-2">{row.length}&quot;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </>
  );
}
