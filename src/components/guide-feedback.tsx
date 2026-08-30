"use client";

import { useEffect, useState } from "react";
import { trackGuideFeedback } from "@/lib/analytics";

type Vote = "up" | "down";

const storageKey = (slug: string) => `bdc-guide-feedback:${slug}`;

/** Lightweight thumbs feedback before the article footer. */
export function GuideFeedback({ slug }: { slug: string }) {
  const [vote, setVote] = useState<Vote | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey(slug));
      if (stored === "up" || stored === "down") setVote(stored);
    } catch {
      // Private browsing or blocked storage.
    }
  }, [slug]);

  function submit(next: Vote) {
    if (vote) return;
    setVote(next);
    trackGuideFeedback(slug, next);
    try {
      localStorage.setItem(storageKey(slug), next);
    } catch {
      // Ignore storage failures.
    }
  }

  return (
    <section
      className="mt-10 rounded-2xl border border-rule bg-paper-2/60 px-5 py-4 sm:px-6"
      aria-label="Article feedback"
    >
      {vote ? (
        <p className="text-sm text-ink-soft">
          Thanks. That helps us write what actually lands.
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium text-ink">Was this useful?</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => submit("up")}
              className="guide-feedback-btn"
              aria-label="Yes, this was useful"
            >
              👍 Yes
            </button>
            <button
              type="button"
              onClick={() => submit("down")}
              className="guide-feedback-btn"
              aria-label="No, this was not useful"
            >
              👎 Not really
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
