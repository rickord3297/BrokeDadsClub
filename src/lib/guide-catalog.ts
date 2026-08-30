import { resources } from "@/lib/resources";

export type CategoryAccent = {
  bar: string;
  soft: string;
  label: string;
};

export const CATEGORY_ACCENTS: Record<string, CategoryAccent> = {
  Money: {
    bar: "bg-pine",
    soft: "bg-pine/10 text-pine",
    label: "",
  },
  Time: {
    bar: "bg-rust",
    soft: "bg-rust/15 text-rust-2",
    label: "T",
  },
  Kids: {
    bar: "bg-gold",
    soft: "bg-gold/20 text-ink",
    label: "K",
  },
  Work: {
    bar: "bg-ink",
    soft: "bg-ink/10 text-ink",
    label: "W",
  },
  Gear: {
    bar: "bg-pine-2",
    soft: "bg-pine-2/15 text-pine",
    label: "G",
  },
};

export function categoryAccent(category: string): CategoryAccent {
  return (
    CATEGORY_ACCENTS[category] ?? {
      bar: "bg-pine",
      soft: "bg-pine/10 text-pine",
      label: "·",
    }
  );
}

export type GuideResourceTieIn = {
  href: string;
  label: string;
  kind: "printable";
};

export function resourceTieInForGuide(
  guideSlug: string,
): GuideResourceTieIn | null {
  const resource = resources.find((item) => item.guideSlug === guideSlug);
  if (!resource) return null;
  return {
    href: `/resources/${resource.slug}`,
    label: resource.title,
    kind: "printable",
  };
}

/** "If you need..." hooks for the Keep going hub. */
const RELATED_HOOKS: Record<string, string> = {
  "the-dad-tax": "If you need the big picture on kid costs",
  "the-47-dollar-grocery-week": "If you need a one-week grocery plan",
  "school-supply-list": "If you need to survive the school list",
  "talking-to-kids-about-money": "If you need calm money talk scripts",
  "the-second-bill": "If you need to see the fees after supplies",
  "birthday-party-math": "If you need a party that stays solvent",
  "gas-station-dinner": "If you need dinner that still counts on the road",
  "cheap-weekend-not-just-screens": "If you need a weekend plan that is not just screens",
  "car-vs-daycare": "If two bills hit the same paycheck",
  "dad-math": "If DIY pride is about to buy another tool",
  "explaining-we-cant-go": "If you need a short, kind no",
  "which-tool-brand-to-buy": "If you are stuck in a battery brand war",
  "cheap-date-night": "If you need 90 minutes that feel like a date",
  "side-hustles-that-dont-steal-bedtime": "If you need cash without losing bedtime",
  "thrift-without-looking-like-a-dare": "If thrift has to look intentional",
  "how-to-handle-the-early-riser": "If 5 a.m. owns the house",
  "kids-who-dont-listen-to-mom": "If kids only listen when Dad speaks",
  "the-kid-who-wont-sleep": "If bedtime is another negotiation",
  "what-do-you-do-for-fun": "If small talk asks about hobbies you lost",
  "when-the-other-dads-vacation-photos-hit": "If their beach photos hit on a Tuesday",
  "the-lonely-dad": "If practice feels like a solo shift",
  "the-pickup-line-is-not-a-networking-event": "If pickup needs one normal line",
  "tagging-along-without-becoming-furniture": "If you keep ending up as furniture",
  "one-dad-coffee-not-a-friend-group": "If you want one coffee, not a crew",
  "the-sports-signup-fee-you-didnt-budget-for": "If the signup fee was not the real bill",
};

export function relatedGuideHook(slug: string, category: string): string {
  return (
    RELATED_HOOKS[slug] ?? `If you need more on ${category.toLowerCase()}`
  );
}
