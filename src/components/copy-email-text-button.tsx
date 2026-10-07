"use client";

import { useState, useSyncExternalStore } from "react";

const IS_DEV = process.env.NODE_ENV === "development";

function subscribe() {
  return () => {};
}

/** Read on the client so the issue page stays statically rendered. */
function rawModeSnapshot() {
  return new URLSearchParams(window.location.search).get("raw") === "true";
}

function copyWithTextarea(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  return ok;
}

export function CopyEmailTextButton({ text }: { text: string }) {
  const rawMode = useSyncExternalStore(subscribe, rawModeSnapshot, () => false);
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  if (!IS_DEV && !rawMode) return null;

  async function copy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      ok = copyWithTextarea(text);
    }
    setStatus(ok ? "copied" : "failed");
    window.setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 print:hidden">
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-paper shadow-lg shadow-ink/25 ring-1 ring-paper/10 transition hover:bg-pine"
      >
        <span aria-hidden className="h-2 w-2 rounded-full bg-gold" />
        {status === "copied" ? "Copied to clipboard" : status === "failed" ? "Copy failed" : "Copy Email Text"}
      </button>
      <span className="sr-only" aria-live="polite">
        {status === "copied" ? "Email text copied to clipboard" : status === "failed" ? "Copy failed" : ""}
      </span>
    </div>
  );
}
