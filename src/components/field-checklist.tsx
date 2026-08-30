import type { ReactNode } from "react";
import type { FieldProtocol, FieldProtocolStep } from "@/lib/guide-content";

function formatInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  if (parts.length === 1 && !parts[0].includes("**")) return text;

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

function StepRow({
  index,
  step,
}: {
  index: number;
  step: FieldProtocolStep;
}) {
  const copyText = step.label
    ? `${step.label}: ${step.detail}`
    : step.detail;

  return (
    <li className="flex gap-3 sm:gap-4">
      <span
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rust/15 font-display text-sm font-semibold text-rust-2"
      >
        {index + 1}
      </span>
      <div className="min-w-0 pt-0.5">
        {step.label ? (
          <p className="text-base font-semibold leading-7 text-ink">
            {step.label}
          </p>
        ) : null}
        <p
          className={`text-base leading-7 text-ink-soft ${step.label ? "mt-0.5" : ""}`}
        >
          {formatInline(step.detail)}
        </p>
        <span className="sr-only">{copyText}</span>
      </div>
    </li>
  );
}

/**
 * High-contrast field protocol box: 3-step checklist pulled from the
 * "Do this..." section, shown directly under the intro.
 */
export function FieldChecklist({ protocol }: { protocol: FieldProtocol }) {
  if (!protocol.steps.length) return null;

  return (
    <aside
      className="mt-8 rounded-2xl border-2 border-rust/35 bg-rust/[0.09] px-4 py-5 shadow-sm ring-1 ring-rust/10 sm:px-6"
      aria-label={protocol.headline}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-rust-2">
        Field protocol
      </p>
      <h2 className="mt-2 font-display text-2xl leading-snug text-ink">
        {protocol.headline}
      </h2>
      <ol className="mt-5 space-y-4">
        {protocol.steps.map((step, index) => (
          <StepRow key={`${step.label}-${index}`} index={index} step={step} />
        ))}
      </ol>
    </aside>
  );
}
