import type { Metadata } from "next";
import { FillCheck, FillLine } from "@/components/fillable-fields";
import { ResourceLayout } from "@/components/resource-layout";
import { requireResource } from "@/lib/resources";
import { site } from "@/lib/site";

const resource = requireResource("birthday-party-budget");

export const metadata: Metadata = {
  title: { absolute: `${resource.seoTitle} | Broke Dads Club` },
  description: resource.description,
  keywords: resource.keywords,
  alternates: {
    canonical: `${site.url}/resources/${resource.slug}`,
  },
};

const activities = [
  { name: "act-park", label: "Park picnic + one game" },
  { name: "act-obstacle", label: "Backyard obstacle course" },
  { name: "act-fort", label: "Fort HQ / blanket fort" },
  { name: "act-bake", label: "Bake and decorate cupcakes" },
  { name: "act-scavenger", label: "Scavenger hunt" },
  { name: "act-movie", label: "Movie premiere at home" },
];

const freeLowCost = [
  { name: "free-park", label: "Local park pavilion (often free or a small permit)" },
  { name: "free-yard", label: "Backyard games / obstacle course" },
  { name: "free-library", label: "Library story room if they will have you" },
  { name: "free-walk", label: "Walk-the-block scavenger hunt" },
  { name: "free-bake", label: "Bake cupcakes together. That is the activity." },
];

export default function BirthdayPartyBudgetPage() {
  return (
    <ResourceLayout resource={resource}>
      <div className="space-y-10 print:space-y-5">
        <div>
          <h2 className="font-display text-3xl">The numbers first</h2>
          <p className="mt-3 text-base leading-7 text-ink-soft">
            Pick the spending limit and the headcount. Everything else fits
            inside.
          </p>
          <FillLine
            name="spend-limit"
            label="Spending limit $"
            placeholder="80"
            wide
          />
          <FillLine name="guest-count" label="Guest count" placeholder="8" />
          <FillLine name="date-time" label="Date / time" />
          <FillLine name="place" label="Place" />
          <div className="mt-4">
            <p className="text-sm font-medium">This party is</p>
            <ul className="mt-2 space-y-2">
              <FillCheck name="party-hosting">Hosting</FillCheck>
              <FillCheck name="party-attending">
                Attending someone else&apos;s
              </FillCheck>
            </ul>
          </div>
        </div>

        <div className="break-inside-avoid rounded-xl border-2 border-ink/30 p-4 print:border-black">
          <h2 className="font-display text-3xl">Max spend per kid</h2>
          <p className="mt-3 text-base leading-7 text-ink-soft">
            Total budget divided by guest count. That is the ceiling for food,
            favors, and the venue combined, per kid. Write it before you look at
            bounce houses.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <FillLine name="max-limit" label="Limit $" placeholder="80" />
            <FillLine name="max-kids" label="÷ kids" placeholder="8" />
            <FillLine
              name="max-each"
              label="= max each $"
              placeholder="10"
              wide
            />
          </div>
        </div>

        <div>
          <h2 className="font-display text-3xl">Spend lines</h2>
          <FillLine name="line-food" label="Food" />
          <FillLine name="line-cake" label="Cake" />
          <FillLine name="line-activity" label="Activity" />
          <FillLine name="line-invites" label="Invites" />
          <FillLine name="line-bags" label="Gifts / bags" />
          <FillLine name="line-total" label="Total" />
          <p className="mt-3 text-sm text-ink-soft">
            Skip goodie bags if money is tight. Kids remember cake and attention
            more than plastic that breaks in the car.
          </p>
        </div>

        <div className="break-inside-avoid">
          <h2 className="font-display text-3xl">Free / low-cost alternatives</h2>
          <p className="mt-3 text-base leading-7 text-ink-soft">
            If the venue quote is bigger than the max-per-kid number, pick from
            here.
          </p>
          <ul className="mt-4 space-y-2">
            {freeLowCost.map((item) => (
              <FillCheck key={item.name} name={item.name}>
                {item.label}
              </FillCheck>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-3xl">Pick one activity</h2>
          <ul className="mt-4 space-y-2">
            {activities.map((item) => (
              <FillCheck key={item.name} name={item.name}>
                {item.label}
              </FillCheck>
            ))}
          </ul>
          <FillLine name="act-other" label="Other" />
          <p className="mt-3 text-sm text-ink-soft">
            One theme, one main activity, cake. That is a party. Everything else
            is garnish.
          </p>
        </div>

        <div>
          <h2 className="font-display text-3xl">90-minute run-of-show</h2>
          <ul className="mt-4 space-y-3 text-base leading-7">
            <li>
              <strong>0-15:</strong> Arrive, stickers, free play
            </li>
            <li>
              <strong>15-45:</strong> Main activity
            </li>
            <li>
              <strong>45-60:</strong> Cake + song
            </li>
            <li>
              <strong>60-75:</strong> Open play
            </li>
            <li>
              <strong>75-90:</strong> Gifts if you want them, then goodbye
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-3xl">Scripts</h2>
          <ul className="mt-4 space-y-3 text-base leading-7">
            <li>
              <strong>To your kid:</strong> &ldquo;Their party was big. Ours will
              be ours.&rdquo;
            </li>
            <li>
              <strong>Hosting:</strong> &ldquo;We&apos;re doing park + cake, come
              hungry.&rdquo;
            </li>
            <li>
              <strong>Can&apos;t make it:</strong> &ldquo;We can&apos;t make that
              one, thanks for including us.&rdquo;
            </li>
          </ul>
        </div>
      </div>
    </ResourceLayout>
  );
}
