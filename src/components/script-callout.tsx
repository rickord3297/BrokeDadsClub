"use client";

import { useState, type ReactNode } from "react";

type ScriptCalloutProps = {
  label?: string;
  kind?: "script" | "truth";
  children: ReactNode;
  /** Plain text used for clipboard; falls back to stripping children. */
  copyText?: string;
  className?: string;
};

function collectText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(collectText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return collectText(
      (node as { props?: { children?: ReactNode } }).props?.children,
    );
  }
  return "";
}

/** Dialogue / practical-line callout with optional copy-to-clipboard. */
export function ScriptCallout({
  label = "Try this line",
  kind = "script",
  children,
  copyText,
  className = "",
}: ScriptCalloutProps) {
  const [copied, setCopied] = useState(false);
  const isTruth = kind === "truth";
  const text = (copyText ?? collectText(children)).trim();

  async function onCopy() {
    if (!text || !navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(text.replace(/^["“]|["”]$/g, "").trim());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can fail in restricted contexts; stay silent.
    }
  }

  return (
    <blockquote
      className={`${isTruth ? "guide-pull-quote" : "guide-script-callout"} relative ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="guide-script-label">{isTruth ? "Keep this" : label}</p>
        {kind === "script" && text ? (
          <button
            type="button"
            onClick={onCopy}
            className="shrink-0 rounded-md border border-pine/20 bg-paper px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-pine transition hover:border-pine/40 hover:text-rust"
            aria-label={copied ? "Copied" : "Copy script"}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>
      {children}
    </blockquote>
  );
}
