import Link from "next/link";
import type { ReactNode } from "react";

export type ActionBoxNextRead = {
  slug: string;
  title: string;
  hook?: string;
};

/** Render light markdown bold (**text**) inside an action step. */
function formatStep(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  if (parts.length === 1 && !parts[0].startsWith("**")) return text;

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

function uniqueSteps(steps: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const step of steps) {
    const trimmed = step.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(trimmed);
  }
  return out.slice(0, 4);
}

/**
 * Standalone action box for the top of guide pages:
 * left accent, numbered steps, optional next-read badge.
 */
export function ActionBox({
  headline = "Do this today (5 minutes)",
  steps,
  nextRead,
}: {
  headline?: string;
  steps: string[];
  nextRead?: ActionBoxNextRead | null;
}) {
  const items = uniqueSteps(steps);
  if (!items.length) return null;

  return (
    <aside
      className="mt-6 overflow-hidden rounded-xl border border-pine/20 border-l-[3px] border-l-pine bg-pine/[0.06]"
      aria-label={headline}
    >
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-pine">
          {headline}
        </p>

        {items.length === 1 ? (
          <p className="mt-2.5 text-base font-medium leading-7 text-ink">
            {formatStep(items[0])}
          </p>
        ) : (
          <ol className="mt-3 space-y-2.5">
            {items.map((step, index) => (
              <li key={step} className="flex gap-3 text-base leading-7 text-ink">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pine text-[11px] font-bold text-paper"
                >
                  {index + 1}
                </span>
                <span className="min-w-0 pt-0.5">{formatStep(step)}</span>
              </li>
            ))}
          </ol>
        )}

        {nextRead ? (
          <p className="mt-4">
            <Link
              href={`/guides/${nextRead.slug}`}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-pine/25 bg-paper px-3 py-1.5 text-sm font-medium text-pine transition hover:border-rust/40 hover:text-rust"
            >
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-rust">
                Next
              </span>
              <span className="min-w-0 truncate">
                {nextRead.hook ?? nextRead.title}
              </span>
              <span aria-hidden>→</span>
            </Link>
          </p>
        ) : null}
      </div>
    </aside>
  );
}

/** @deprecated Prefer ActionBox; kept for existing imports. */
export function GuideActionBox({
  action,
  steps,
  nextRead,
}: {
  action?: string;
  steps?: string[];
  nextRead?: ActionBoxNextRead | null;
}) {
  return (
    <ActionBox
      steps={steps?.length ? steps : action ? [action] : []}
      nextRead={nextRead}
    />
  );
}
