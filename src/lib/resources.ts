import { site } from "@/lib/site";

export type ResourceTag =
  | "5-Min Prep"
  | "Single-Page"
  | "Seasonal"
  | "Ink-Friendly"
  | "Fillable";

export type ResourcePreviewVariant = "sheet" | "fridge" | "card";

export type Resource = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  excerpt: string;
  intro: string;
  printLabel: string;
  guideSlug: string;
  guideLabel: string;
  keywords: string[];
  tags: ResourceTag[];
  companionGuideSlugs: string[];
  previewVariant?: ResourcePreviewVariant;
};

export const resources: Resource[] = [
  {
    slug: "sitter-handoff-card",
    title: "Solo parent / sitter hand-off card",
    seoTitle: "Free Babysitter Instructions Sheet (Printable) | Broke Dads Club",
    description:
      "One printable sitter sheet: wifi, bedtime scripts, medicine doses by weight, emergency contacts, and meltdown triggers. Fill on your phone, print for the counter.",
    excerpt:
      "Wifi, bedtime scripts, meds by weight, and meltdown triggers. One sheet by the door, not five texts from the driveway.",
    intro:
      "Fill this once and tape it where the sitter will see it. Update when wifi or meds change. Your browser saves what you type on this device.",
    printLabel: "Print hand-off card",
    guideSlug: "the-kid-who-wont-sleep",
    guideLabel: "the kid who won't sleep",
    keywords: [
      "babysitter instruction sheet printable",
      "sitter handoff checklist parents",
      "bedtime notes for babysitter",
      "medicine dosing sheet for sitter",
    ],
    tags: ["5-Min Prep", "Single-Page", "Ink-Friendly", "Fillable"],
    companionGuideSlugs: [
      "kids-who-dont-listen-to-mom",
      "the-after-school-collapse-is-not-a-bad-kid",
      "explaining-we-cant-go",
    ],
  },
  {
    slug: "subscription-burn-sheet",
    title: "Subscription and auto-renew burn sheet",
    seoTitle: "Free Subscription Audit Worksheet (Monthly & Annual) | Broke Dads Club",
    description:
      "Track streaming, apps, and box subscriptions in one fillable sheet. See monthly and annual burn, mark what to cut today.",
    excerpt:
      "List the $7.99 charges. See the annual number. Check what to cut today.",
    intro:
      "Forgotten renewals hide $50-$100 a month. Type each service, watch the annual tally update, and check the ones you will cancel tonight.",
    printLabel: "Print burn sheet",
    guideSlug: "the-dad-tax",
    guideLabel: "the dad tax",
    keywords: [
      "subscription audit worksheet",
      "cancel subscriptions checklist",
      "monthly subscription tracker printable",
      "streaming budget worksheet",
    ],
    tags: ["5-Min Prep", "Single-Page", "Fillable"],
    companionGuideSlugs: [
      "talking-to-kids-about-money",
      "side-hustles-that-dont-steal-bedtime",
      "dad-math",
    ],
  },
  {
    slug: "youth-sports-true-cost",
    title: "Youth sports true-cost estimator",
    seoTitle: "Free Youth Sports Cost Calculator (Printable) | Broke Dads Club",
    description:
      "Add registration, gear, travel, and snack lines for one season. Fillable sports budget calculator before you sign up.",
    excerpt:
      "Registration is line one. Gear, travel, and concessions finish the story.",
    intro:
      "Coaches quote registration. The real tab includes uniforms, gas, and the team photo package. Fill every line before you commit.",
    printLabel: "Print cost estimator",
    guideSlug: "the-sports-signup-fee-you-didnt-budget-for",
    guideLabel: "the sports signup fee you did not budget for",
    keywords: [
      "youth sports cost calculator",
      "kids sports budget worksheet",
      "how much does kids sports cost",
      "soccer registration hidden costs",
    ],
    tags: ["5-Min Prep", "Single-Page", "Fillable"],
    companionGuideSlugs: [
      "snack-duty-without-the-costco-run",
      "the-second-bill",
      "explaining-we-cant-go",
    ],
  },
  {
    slug: "morning-launchpad-checklist",
    title: "Morning launchpad door checklist",
    seoTitle: "Free School Morning Checklist for Kids (Printable) | Broke Dads Club",
    description:
      "Bold four-item door checklist: shoes, water bottle, backpack, jacket. Kid-readable printable to stop the 8:05 a.m. hallway scramble.",
    excerpt:
      "Four checks by the garage door. Shoes, water, backpack, jacket.",
    intro:
      "Post at kid height by the exit you actually use. They check, you initial. Less yelling, more bus.",
    printLabel: "Print launchpad",
    guideSlug: "how-to-handle-the-early-riser",
    guideLabel: "how to handle the early riser",
    keywords: [
      "school morning routine checklist printable",
      "kids morning checklist door",
      "backpack ready checklist",
    ],
    tags: ["5-Min Prep", "Single-Page", "Ink-Friendly", "Fillable"],
    previewVariant: "fridge",
    companionGuideSlugs: [
      "packing-school-lunch-without-a-guilt-spiral",
      "the-after-school-collapse-is-not-a-bad-kid",
    ],
  },
  {
    slug: "rainy-day-play-matrix",
    title: "Rainy day $0 play matrix",
    seoTitle: "Free Rainy Day Activity Grid for Kids (Printable) | Broke Dads Club",
    description:
      "3x3 grid of zero-cost indoor activities by mess level and time block. Fridge-friendly rainy day planner for parents.",
    excerpt:
      "Morning burn, quiet hour, 4 p.m. slump. Pick a box before the tablets win.",
    intro:
      "Circle one idea per row before the weather app ruins your plan. Zero mess to heavy prep, all cheap or free.",
    printLabel: "Print play matrix",
    guideSlug: "cheap-weekend-not-just-screens",
    guideLabel: "cheap weekend that isn't just screen time",
    keywords: [
      "rainy day activities for kids at home",
      "indoor activities grid printable",
      "no screen rainy day planner",
    ],
    tags: ["5-Min Prep", "Single-Page", "Ink-Friendly", "Fillable"],
    previewVariant: "fridge",
    companionGuideSlugs: [
      "cheap-weekend-not-just-screens",
      "gas-station-dinner",
    ],
  },
  {
    slug: "can-we-afford-it-flowchart",
    title: "Can we afford it? decision sheet",
    seoTitle: "Free 'Can We Afford It?' Decision Worksheet | Broke Dads Club",
    description:
      "Four-step fillable flow for impulse buys and kid requests: name the cost, check the week, wait one sleep, say the line.",
    excerpt:
      "Four steps before the card comes out. Takes the heat off saying not right now.",
    intro:
      "Use for gear, games, and checkout-line wants. Not a lecture, a checklist.",
    printLabel: "Print decision sheet",
    guideSlug: "explaining-we-cant-go",
    guideLabel: "explaining we can't go",
    keywords: [
      "can we afford it worksheet",
      "impulse buy decision printable",
      "how to say no to kids buying stuff",
      "family purchase decision checklist",
    ],
    tags: ["5-Min Prep", "Single-Page", "Fillable"],
    companionGuideSlugs: [
      "the-dad-tax",
      "marketplace-before-the-mall",
      "talking-to-kids-about-money",
    ],
  },
  {
    slug: "grocery-week-checklist",
    title: "The $47 grocery-week checklist",
    seoTitle: "Free $47 Family Grocery Budget Checklist (Printable)",
    description:
      "Printable family grocery budget checklist for about $47 a week: protein, starch, produce, pantry targets, and a swap box. Full fillable PDF with Sunday email signup.",
    excerpt:
      "A week of dinners for about 3-4 people. Dozen eggs, a pack of thighs, pasta on the tired night. Shop once.",
    intro:
      "Print this before you walk into the store, or type your numbers on your phone first. Category targets keep the cart honest. The swap box lets you take a markdown without blowing the week.",
    printLabel: "Print checklist",
    guideSlug: "the-47-dollar-grocery-week",
    guideLabel: "the $47 grocery week",
    keywords: [
      "family grocery budget checklist",
      "$50 a week grocery list",
      "cheap grocery list for family of 4",
      "printable grocery budget worksheet",
    ],
    tags: ["5-Min Prep", "Single-Page", "Ink-Friendly", "Fillable"],
    companionGuideSlugs: ["the-dad-tax", "gas-station-dinner", "dad-math"],
  },
  {
    slug: "boring-bedtime-night-card",
    title: "Boring bedtime night card",
    seoTitle: "Free Kids Bedtime Routine Checklist (Printable)",
    description:
      "Free printable kids bedtime routine checklist for tired dads: same order every night, one goodbye line, walk-back script, and a night-two plan so bedtime stops being a negotiation.",
    excerpt:
      "Same five steps. Same goodbye line. Walk them back without a second book. Tape it to the door.",
    intro:
      "Fill the order and the goodbye line before 8:40 p.m. Post it where you stand when they come out. The card is the plan so you do not invent policy in a dark hallway.",
    printLabel: "Print night card",
    guideSlug: "the-kid-who-wont-sleep",
    guideLabel: "the kid who won't sleep",
    keywords: [
      "kids bedtime routine checklist printable",
      "bedtime checklist for toddlers",
      "how to get kids to sleep checklist",
      "printable bedtime routine for parents",
    ],
    tags: ["5-Min Prep", "Single-Page", "Ink-Friendly", "Fillable"],
    companionGuideSlugs: [
      "the-after-school-collapse-is-not-a-bad-kid",
      "explaining-we-cant-go",
      "cheap-date-night",
    ],
  },
  {
    slug: "school-supply-triage",
    title: "School supply triage sheet",
    seoTitle: "Free School Supply List Budget Triage Sheet (Printable)",
    description:
      "Free printable school supply list triage: already-own inventory, must / reuse / skip columns, and a budget cap field so August does not wreck grocery money.",
    excerpt:
      "Three columns for the school list. Must, reuse, skip. Write the number before you enter the store.",
    intro:
      "Fill the Already Own box first. Then sort the teacher list into Must, Reuse, and Skip. Write the budget cap next to the store name before you walk in.",
    printLabel: "Print triage sheet",
    guideSlug: "school-supply-list",
    guideLabel: "the school supply list that quietly wrecks August",
    keywords: [
      "school supply list on a budget",
      "back to school supply checklist printable",
      "cheap school supplies triage",
      "school supply budget worksheet",
    ],
    tags: ["5-Min Prep", "Single-Page", "Seasonal", "Fillable"],
    companionGuideSlugs: [
      "the-second-bill",
      "the-dad-tax",
      "talking-to-kids-about-money",
    ],
  },
  {
    slug: "birthday-party-budget",
    title: "Birthday party budget template",
    seoTitle: "Birthday Party Budget Template (Free Printable Worksheet)",
    description:
      "Free birthday party budget template for kids: spending limit, guest count, per-kid max, spend lines, and free or low-cost alternatives. Printable worksheet for parents.",
    excerpt:
      "Pick the spending limit and the kid count first. Then cake, one activity, done.",
    intro:
      "Set the spending limit and the kid count first. The sheet does the per-kid math so venue and favor limits stay obvious. Use the free and low-cost list when the bounce house quote is a joke.",
    printLabel: "Print budget template",
    guideSlug: "birthday-party-math",
    guideLabel: "birthday party math",
    keywords: [
      "birthday party budget template",
      "kids birthday party budget worksheet",
      "birthday party budget printable",
      "cheap birthday party planning sheet",
      "low cost kids birthday ideas worksheet",
    ],
    tags: ["5-Min Prep", "Single-Page", "Fillable"],
    companionGuideSlugs: [
      "explaining-we-cant-go",
      "talking-to-kids-about-money",
      "cheap-weekend-not-just-screens",
    ],
  },
];

export function getResource(slug: string) {
  return resources.find((resource) => resource.slug === slug) ?? null;
}

export function requireResource(slug: string) {
  const resource = getResource(slug);
  if (!resource) {
    throw new Error(`Unknown resource: ${slug}`);
  }
  return resource;
}

export function otherResources(slug: string) {
  return resources.filter((resource) => resource.slug !== slug);
}

export function getResourceByGuideSlug(guideSlug: string) {
  return resources.find((resource) => resource.guideSlug === guideSlug) ?? null;
}

export const resourceIdeaMailto = `mailto:${site.email}?subject=${encodeURIComponent(
  "Printable idea for Broke Dads Club",
)}`;
