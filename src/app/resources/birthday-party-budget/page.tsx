import type { Metadata } from "next";
import {
  CheckRow,
  ResourceLayout,
  WriteLine,
} from "@/components/resource-layout";
import { requireResource } from "@/lib/resources";
import { site } from "@/lib/site";

const resource = requireResource("birthday-party-budget");

export const metadata: Metadata = {
  title: resource.seoTitle,
  description: resource.description,
  alternates: {
    canonical: `${site.url}/resources/${resource.slug}`,
  },
};

const activities = [
  "Park picnic + one game",
  "Backyard obstacle course",
  "Fort HQ / blanket fort",
  "Bake and decorate cupcakes",
  "Scavenger hunt",
  "Movie premiere at home",
];

export default function BirthdayPartyBudgetPage() {
  return (
    <ResourceLayout resource={resource}>
      <div className="space-y-10">
        <div>
          <h2 className="font-display text-3xl">The fence</h2>
          <p className="mt-3 text-base leading-7 text-ink-soft">
            Pick the numbers first. Everything else fits inside.
          </p>
          <WriteLine label="Dollar limit" />
          <WriteLine label="Kid count" />
          <WriteLine label="Date / time" />
          <WriteLine label="Place" />
          <div className="mt-4">
            <p className="text-sm font-medium text-ink-soft">This party is</p>
            <ul className="mt-2 space-y-2">
              <CheckRow>Hosting</CheckRow>
              <CheckRow>Attending someone else&apos;s</CheckRow>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="font-display text-3xl">Spend lines</h2>
          <WriteLine label="Food" />
          <WriteLine label="Cake" />
          <WriteLine label="Activity" />
          <WriteLine label="Invites" />
          <WriteLine label="Gifts / bags" />
          <WriteLine label="Total" />
          <p className="mt-3 text-sm text-ink-soft">
            Skip goodie bags if money is tight. Kids remember cake and attention
            more than plastic that breaks in the car.
          </p>
        </div>

        <div>
          <h2 className="font-display text-3xl">Pick one activity</h2>
          <ul className="mt-4 space-y-2">
            {activities.map((item) => (
              <CheckRow key={item}>{item}</CheckRow>
            ))}
            <CheckRow>Other: ____________________________</CheckRow>
          </ul>
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
