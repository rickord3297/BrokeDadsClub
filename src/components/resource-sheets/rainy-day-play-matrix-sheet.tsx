"use client";

import { FillLine } from "@/components/fillable-fields";

const messLevels = ["Zero mess", "Medium mess", "Heavy prep"] as const;
const timeBlocks = [
  { key: "morning", title: "Morning burn", hint: "Get energy out" },
  { key: "quiet", title: "Quiet hour", hint: "You need a call" },
  { key: "slump", title: "4 p.m. slump", hint: "Before dinner" },
] as const;

export function RainyDayPlayMatrixSheet() {
  return (
    <div className="space-y-8 print:space-y-4">
      <p className="text-base leading-7 text-ink-soft">
        Pick one box per time block. $0 or close. Circle your plan before anyone
        opens a tablet on autopilot.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="border border-ink/25 p-2 print:border-black" />
              {messLevels.map((level) => (
                <th
                  key={level}
                  className="border border-ink/25 p-2 font-display text-base print:border-black"
                >
                  {level}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeBlocks.map((block) => (
              <tr key={block.key}>
                <td className="border border-ink/25 p-2 align-top print:border-black">
                  <p className="font-display text-lg">{block.title}</p>
                  <p className="text-xs text-ink-soft">{block.hint}</p>
                </td>
                {messLevels.map((level, colIndex) => (
                  <td
                    key={level}
                    className="border border-ink/25 p-2 align-top print:border-black"
                  >
                    <FillLine
                      name={`rainy-${block.key}-${colIndex}`}
                      placeholder="Activity idea"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="font-display text-2xl">Starter ideas (cross out what you hate)</h2>
        <ul className="mt-3 grid gap-2 text-sm leading-6 sm:grid-cols-2">
          <li>Zero: dance party, fort, scavenger hunt list</li>
          <li>Medium: play-dough, baking, cardboard box city</li>
          <li>Heavy: science vinegar tray, slime (if you mean it)</li>
        </ul>
      </div>
    </div>
  );
}
