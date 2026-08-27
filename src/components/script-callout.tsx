"use client";

import { useState, type ReactNode } from "react";

type ScriptCalloutProps = {
  label?: string;
  kind?: "script" | "truth";
  children: ReactNode;
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

/** Dialogue / truth callout for markdown blockquotes only. */
export function ScriptCallout({
  label,
  kind = "script",
  children,
  copyText,
  className = "",
}: ScriptCalloutProps) {
  const [copied, setCopied] = useState(false);
  const isTruth = kind === "truth";
  const heading = label ?? (isTruth ? "Keep this" : "Try this line");
  const text = (copyText ?? collectText(children)).trim();

  async function onCopy() {
    if (!text || !navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(
        text
          .replace(/^(truth|remember|note|mindset):\s*/i, "")
          .replace(/^["“]|["”]$/g, "")
          .trim(),
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can fail in restricted contexts; stay silent.
    }
  }

  return (
    <aside
      className={`${isTruth ? "guide-pull-quote" : "guide-script-callout"} ${className}`}
      aria-label={heading}
    >
      <div className="guide-callout-header">
        <span className="guide-script-label">{heading}</span>
        {kind === "script" && text ? (
          <button
            type="button"
            onClick={onCopy}
            className="guide-callout-copy"
            aria-label={copied ? "Copied" : "Copy script"}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>
      <div className="guide-callout-body">{children}</div>
    </aside>
  );
}
