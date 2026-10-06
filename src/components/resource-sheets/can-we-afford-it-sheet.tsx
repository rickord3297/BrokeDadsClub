"use client";

import { FillCheck, FillLine } from "@/components/fillable-fields";

const steps = [
  {
    title: "1. Name the number",
    body: "Write the real cost, tax and shipping included. Not the monthly payment fantasy.",
    field: "afford-cost",
    placeholder: "$84 cleats, $12/month app",
  },
  {
    title: "2. Check the week",
    body: "Does this fit groceries, gas, and the school bill already due? Yes or not yet.",
    field: "afford-week",
    placeholder: "Paycheck after rent / daycare",
  },
  {
    title: "3. Wait one sleep",
    body: "Impulse buys lose power overnight. Still want it tomorrow? Continue.",
    field: "afford-wait",
    placeholder: "Revisit date",
  },
  {
    title: "4. Say the line",
    body: "Kid or adult, same script. Not a speech.",
    field: "afford-script",
    placeholder: "Not this week. We have a plan.",
  },
] as const;

export function CanWeAffordItSheet() {
  return (
    <div className="space-y-8 print:space-y-5">
      <p className="text-base leading-7 text-ink-soft">
        Four steps before the card comes out. Takes the shame out of &ldquo;not
        right now.&rdquo;
      </p>

      {steps.map((step) => (
        <div
          key={step.field}
          className="break-inside-avoid rounded-xl border-2 border-ink/25 p-4 print:border-black"
        >
          <h2 className="font-display text-2xl">{step.title}</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{step.body}</p>
          <FillLine
            name={step.field}
            label="Your note"
            placeholder={step.placeholder}
            wide
          />
          <div className="mt-3">
            <FillCheck name={`${step.field}-done`}>Step done</FillCheck>
          </div>
        </div>
      ))}

      <FillLine name="afford-alternative" label="Cheaper alternative" placeholder="Marketplace, borrow, wait for sale" wide />
    </div>
  );
}
