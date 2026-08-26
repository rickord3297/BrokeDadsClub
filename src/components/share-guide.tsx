"use client";

import { useState } from "react";
import { trackGuideShare } from "@/lib/analytics";

export function ShareGuide({
  title,
  url,
  slug,
}: {
  title: string;
  url: string;
  slug: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url, text: title });
        trackGuideShare(slug, "native");
        return;
      } catch {
        // User cancelled or share failed; fall through to copy.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      trackGuideShare(slug, "copy");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked; ignore.
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="rounded-full border border-rule px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft hover:border-pine hover:text-pine"
    >
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
