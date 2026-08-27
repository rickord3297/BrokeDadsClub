import type { ReactNode } from "react";

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

/**
 * Quick-win box under the intro. One clear move, not a second article.
 */
export function ActionBox({
  headline = "Do this today (5 minutes)",
  steps,
}: {
  headline?: string;
  steps: string[];
}) {
  const action = steps.map((step) => step.trim()).find(Boolean);
  if (!action) return null;

  return (
    <aside
      className="mt-8 rounded-xl border border-pine/20 border-l-[3px] border-l-pine bg-pine/[0.06] px-4 py-4 sm:px-5"
      aria-label={headline}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-pine">
        {headline}
      </p>
      <p className="mt-2 text-base font-medium leading-7 text-ink">
        {formatStep(action)}
      </p>
    </aside>
  );
}

/** @deprecated Prefer ActionBox. */
export function GuideActionBox({
  action,
  steps,
}: {
  action?: string;
  steps?: string[];
  nextRead?: unknown;
}) {
  return (
    <ActionBox steps={steps?.length ? steps : action ? [action] : []} />
  );
}
