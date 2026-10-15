"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { trackWelcomeBack } from "@/lib/analytics";

const STORAGE_KEY = "bdc_welcome_back_v1";
/** Still counting as a first session; don't interrupt someone who just landed. */
const FIRST_SESSION_MS = 12 * 60 * 60 * 1000;

export type WelcomeBackItem = {
  kind: "guide" | "newsletter";
  slug: string;
  title: string;
  href: string;
  publishedAt: string;
  kicker: string;
};

type Stored = {
  firstVisitAt: number;
  lastVisitAt: number;
  dismissedKey?: string;
};

function readStored(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    if (typeof parsed.firstVisitAt !== "number" || typeof parsed.lastVisitAt !== "number") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeStored(next: Stored) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("bdc-welcome-back"));
  } catch {
    // Private mode can block storage; skip the banner rather than break the page.
  }
}

function itemKey(item: WelcomeBackItem): string {
  return `${item.kind}:${item.slug}`;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("bdc-welcome-back", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("bdc-welcome-back", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function shouldShow(latest: WelcomeBackItem): boolean {
  const stored = readStored();
  if (!stored) return false;
  if (Date.now() - stored.firstVisitAt < FIRST_SESSION_MS) return false;
  if (stored.dismissedKey === itemKey(latest)) return false;
  return true;
}

/** Homepage banner for returning visitors: one latest piece they may have missed. */
export function WelcomeBackBanner({ latest }: { latest: WelcomeBackItem | null }) {
  const trackedKey = useRef<string | null>(null);

  // Stamp the first visit / refresh lastVisit before the banner decides.
  useEffect(() => {
    if (!latest) return;
    const now = Date.now();
    const stored = readStored();
    if (!stored) {
      writeStored({ firstVisitAt: now, lastVisitAt: now });
      return;
    }
    writeStored({ ...stored, lastVisitAt: now });
  }, [latest]);

  const visible = useSyncExternalStore(
    subscribe,
    () => (latest ? shouldShow(latest) : false),
    () => false,
  );

  useEffect(() => {
    if (!visible || !latest) return;
    const key = itemKey(latest);
    if (trackedKey.current === key) return;
    trackedKey.current = key;
    trackWelcomeBack(latest.kind, latest.slug);
  }, [visible, latest]);

  if (!visible || !latest) return null;
  const shown = latest;

  function dismiss() {
    const stored = readStored();
    const now = Date.now();
    writeStored({
      firstVisitAt: stored?.firstVisitAt ?? now,
      lastVisitAt: now,
      dismissedKey: itemKey(shown),
    });
  }

  return (
    <aside
      className="border-b border-pine/20 bg-pine text-paper"
      aria-label="Welcome back"
    >
      <div className="mx-auto flex max-w-6xl items-start gap-4 px-4 py-3 sm:items-center sm:px-6">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
            Welcome back · here&apos;s what you missed
          </p>
          <p className="mt-1 font-display text-lg leading-snug sm:text-xl">
            <Link
              href={shown.href}
              className="transition hover:text-gold"
              onClick={dismiss}
            >
              {shown.title}
            </Link>
          </p>
          <p className="mt-0.5 text-xs text-paper/75">{shown.kicker}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={shown.href}
            onClick={dismiss}
            className="hidden h-9 items-center rounded-md bg-gold px-3 text-sm font-semibold text-ink transition hover:bg-paper sm:inline-flex"
          >
            Read it
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-paper/70 transition hover:bg-pine-2 hover:text-paper"
            aria-label="Dismiss"
          >
            <span aria-hidden className="text-lg leading-none">
              ×
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
