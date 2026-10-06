"use client";

import { FillCheck, FillLine } from "@/components/fillable-fields";

const launchItems = [
  { name: "launch-shoes", label: "Shoes on feet (not by the door)" },
  { name: "launch-water", label: "Water bottle packed" },
  { name: "launch-backpack", label: "Backpack zipped, homework in" },
  { name: "launch-jacket", label: "Jacket staged for the weather" },
] as const;

export function MorningLaunchpadSheet() {
  return (
    <div className="space-y-8 print:space-y-4">
      <p className="text-base leading-7 text-ink-soft print:text-sm">
        Post by the garage door. Kid checks, parent verifies. Stops the 8:05
        hallway yell.
      </p>
      <FillLine name="launch-kid" label="Kid name" placeholder="Who checks" />
      <FillLine name="launch-bus" label="Out the door by" placeholder="7:45 a.m." />

      <ul className="mt-6 space-y-6 print:space-y-4">
        {launchItems.map((item) => (
          <li key={item.name} className="list-none">
            <FillCheck name={item.name}>
              <span className="font-display text-2xl leading-tight sm:text-3xl print:text-[22pt]">
                {item.label}
              </span>
            </FillCheck>
          </li>
        ))}
      </ul>

      <div className="rounded-xl border-2 border-ink/25 p-4 print:border-black">
        <p className="font-display text-xl">Parent sign-off</p>
        <FillLine name="launch-parent-initials" label="Initials" placeholder="___" />
      </div>
    </div>
  );
}
