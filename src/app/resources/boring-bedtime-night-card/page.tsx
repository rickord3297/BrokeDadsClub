import type { Metadata } from "next";
import { FillCheck, FillLine } from "@/components/fillable-fields";
import { ResourceLayout } from "@/components/resource-layout";
import { requireResource } from "@/lib/resources";
import { resourcePageMetadata } from "@/lib/seo";

const resource = requireResource("boring-bedtime-night-card");

export const metadata: Metadata = resourcePageMetadata(resource);

const routineDefaults = [
  { name: "step-bathroom", label: "Bathroom", sampleChecked: true },
  { name: "step-pjs", label: "Pajamas", sampleChecked: true },
  { name: "step-teeth", label: "Teeth", sampleChecked: true },
  { name: "step-book", label: "One book (or two short ones)", sampleChecked: true },
  { name: "step-lights", label: "Lights down, goodbye, leave", sampleChecked: true },
];

const lastCheck = [
  { name: "check-water", label: "Water (one cup)", sampleChecked: true },
  { name: "check-blanket", label: "Blanket where they want it", sampleChecked: true },
  { name: "check-stuffed", label: "Stuffed animal / lovey", sampleChecked: true },
  { name: "check-nightlight", label: "Nightlight / door set", sampleChecked: false },
];

export default function BoringBedtimeNightCardPage() {
  return (
    <ResourceLayout resource={resource}>
      <div className="space-y-10 print:space-y-5">
        <div>
          <h2 className="font-display text-3xl">Who / lights-out</h2>
          <p className="mt-3 text-base leading-7 text-ink-soft">
            Write it once. Do not renegotiate it at 8:40.
          </p>
          <FillLine
            name="kid-name"
            label="Kid"
            placeholder="Name / age"
            sample="Maya, 4"
          />
          <FillLine
            name="lights-out"
            label="Lights out"
            placeholder="8:15"
            sample="8:15"
          />
          <FillLine
            name="walk-back-parent"
            label="Walk-backs"
            placeholder="Who does them"
            sample="Dad on school nights"
            wide
          />
        </div>

        <div className="break-inside-avoid">
          <h2 className="font-display text-3xl">Boring routine (same order)</h2>
          <p className="mt-3 text-base leading-7 text-ink-soft">
            Say the list out loud before it starts. Kids argue less with a list
            than with a vibe. Cross off as you go, or leave it as the wall
            script.
          </p>
          <ul className="mt-4 space-y-2">
            {routineDefaults.map((item) => (
              <FillCheck
                key={item.name}
                name={item.name}
                sampleChecked={item.sampleChecked}
              >
                {item.label}
              </FillCheck>
            ))}
          </ul>
          <FillLine
            name="step-extra"
            label="Extra (optional)"
            placeholder="Only if already promised"
            sample=""
          />
        </div>

        <div className="break-inside-avoid rounded-xl border-2 border-ink/30 p-4 print:border-black">
          <h2 className="font-display text-3xl">Goodbye line</h2>
          <p className="mt-3 text-base leading-7 text-ink-soft">
            Identical words every night. Novelty is fuel.
          </p>
          <FillLine
            name="goodbye-line"
            label="Say"
            placeholder='I love you. Sleep time. See you in the morning.'
            sample="I love you. Sleep time. See you in the morning."
            wide
          />
        </div>

        <div>
          <h2 className="font-display text-3xl">One last check</h2>
          <p className="mt-3 text-base leading-7 text-ink-soft">
            Then you are done. Not &ldquo;one more song&rdquo; as a lifestyle.
          </p>
          <ul className="mt-4 space-y-2">
            {lastCheck.map((item) => (
              <FillCheck
                key={item.name}
                name={item.name}
                sampleChecked={item.sampleChecked}
              >
                {item.label}
              </FillCheck>
            ))}
          </ul>
        </div>

        <div className="break-inside-avoid">
          <h2 className="font-display text-3xl">If they come out</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-base leading-7">
            <li>Walk them back. Almost no talk.</li>
            <li>No second book. No lecture. No restart.</li>
            <li>Same goodbye line. Leave again.</li>
          </ol>
          <FillLine
            name="door-line"
            label="From the door"
            placeholder="You're safe. It's sleep time."
            sample="You're safe. It's sleep time."
            wide
          />
          <p className="mt-3 text-sm text-ink-soft">
            Instant replies from the couch train a help desk. Stretch the
            silence after one answer.
          </p>
        </div>

        <div>
          <h2 className="font-display text-3xl">Stall or scared?</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-rule p-4 print:border-black/40">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-rust">
                Stall
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Requests keep upgrading. Body is busy. Voice is a whine. Shut
                the door on the negotiation.
              </p>
            </div>
            <div className="rounded-xl border border-rule p-4 print:border-black/40">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-rust">
                Fear
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Same worry every night. Body is tight. Fix the room (light,
                closet), keep the same boring script.
              </p>
            </div>
          </div>
          <FillLine
            name="room-fix"
            label="Room fix"
            placeholder="Hall light width / closet open"
            sample="Hall light two inches"
          />
        </div>

        <div className="break-inside-avoid">
          <h2 className="font-display text-3xl">Night two plan</h2>
          <p className="mt-3 text-base leading-7 text-ink-soft">
            Night two is usually louder. That is not failure. Count walk-backs.
            Give it seven nights before you change the plan.
          </p>
          <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
            <FillLine
              name="night-exits"
              label="Exits tonight"
              placeholder="0"
              sample="7"
            />
            <FillLine
              name="asleep-by"
              label="Asleep by"
              placeholder="8:45"
              sample="8:52"
            />
          </div>
          <ul className="mt-4 space-y-2">
            <FillCheck name="plan-seven" sampleChecked>
              Keep this card for seven nights before changing anything
            </FillCheck>
            <FillCheck name="plan-partner" sampleChecked={false}>
              Partner agreed on the same goodbye line
            </FillCheck>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-3xl">Do not do at 8:40</h2>
          <ul className="mt-4 space-y-2 text-base leading-7">
            <li>Guilt speech about how tired you are</li>
            <li>Threaten a consequence you will not enforce at midnight</li>
            <li>Turn on a bright hall light and restart the day</li>
            <li>Bargain with treats for tomorrow</li>
          </ul>
        </div>
      </div>
    </ResourceLayout>
  );
}
