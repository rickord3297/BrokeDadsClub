"use client";

import { FillCheck, FillLine } from "@/components/fillable-fields";

export function SitterHandoffSheet() {
  return (
    <div className="space-y-8 print:space-y-5">
      <p className="rounded-lg border border-pine/20 bg-pine/[0.06] px-4 py-3 text-sm leading-6 text-ink-soft print:border-black/20">
        Tape this to the counter. Fill once, update when meds or wifi change.
        Saves on your phone automatically in this browser.
      </p>

      <div className="break-inside-avoid">
        <h2 className="font-display text-3xl">Emergency and house</h2>
        <FillLine name="parent-1" label="Parent 1" placeholder="Name · cell" wide />
        <FillLine name="parent-2" label="Parent 2" placeholder="Name · cell" wide />
        <FillLine name="pediatrician" label="Pediatrician" placeholder="Office · after-hours" wide />
        <FillLine name="address" label="Address" wide />
        <FillLine name="wifi" label="Wifi" placeholder="Network · password" wide />
        <FillLine name="alarm" label="Alarm code" />
        <FillLine name="shutoff" label="Water / breaker note" placeholder="Main shutoff location" wide />
      </div>

      <div className="break-inside-avoid">
        <h2 className="font-display text-3xl">Kid rundown</h2>
        <FillLine name="kid-name-age" label="Name / age" />
        <FillLine name="bedtime-target" label="Bedtime target" placeholder="8:30 p.m. lights out" wide />
        <FillLine name="allowed-snacks" label="Allowed snacks" placeholder="Cheese, fruit, water" wide />
        <FillLine name="comfort-item" label="Comfort item" placeholder="Blue blanket, stuffed dog" wide />
        <FillLine name="allergies" label="Allergies" placeholder="None / list" wide />
      </div>

      <div className="break-inside-avoid rounded-xl border-2 border-ink/30 p-4 print:border-black">
        <h2 className="font-display text-3xl">Medicine by weight</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Confirm dose with your pediatrician or the bottle label. Write current
          weight so sitters do not guess.
        </p>
        <FillLine name="weight-today" label="Weight today" placeholder="42 lb" />
        <FillLine name="tylenol-dose" label="Tylenol dose" placeholder="Per label for weight" wide />
        <FillLine name="motrin-dose" label="Motrin dose" placeholder="Per label for weight" wide />
        <FillLine name="last-dose" label="Last dose given" placeholder="Motrin 6 p.m. Tue" wide />
        <FillLine name="med-notes" label="Other meds" wide />
      </div>

      <div>
        <h2 className="font-display text-3xl">Bedtime scripts</h2>
        <p className="mt-2 text-sm text-ink-soft">Short lines they can repeat.</p>
        <FillLine name="script-bath" label="After bath" placeholder="PJs, teeth, one book" wide />
        <FillLine name="script-lights" label="Lights out" placeholder="See you in the morning. Love you." wide />
        <FillLine name="script-wake" label="If they wake up" placeholder="Water, back to bed. No show." wide />
      </div>

      <div>
        <h2 className="font-display text-3xl">Do not open list</h2>
        <p className="mt-2 text-sm text-ink-soft">Known meltdown triggers and screen rules.</p>
        <ul className="mt-3 space-y-2">
          <FillCheck name="trigger-screens">No screens after __ (write time below)</FillCheck>
          <FillCheck name="trigger-sugar">No candy / soda (unless parent left it)</FillCheck>
          <FillCheck name="trigger-dog">Do not let the dog out front unsupervised</FillCheck>
        </ul>
        <FillLine name="forbidden-shows" label="Shows off limits" placeholder="YouTube rabbit holes" wide />
        <FillLine name="meltdown-triggers" label="Meltdown triggers" placeholder="Hungry, overtired, losing at games" wide />
        <FillLine name="calm-trick" label="What calms them" placeholder="Quiet room, snack, blanket" wide />
      </div>
    </div>
  );
}
