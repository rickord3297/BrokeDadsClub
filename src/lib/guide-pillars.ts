import { site } from "@/lib/site";

export type GuidePillar = {
  slug: "money" | "time" | "kids";
  category: "Money" | "Time" | "Kids";
  title: string;
  seoTitle: string;
  description: string;
  keywords: string[];
  headline: string;
  intro: string[];
};

export const GUIDE_PILLARS: GuidePillar[] = [
  {
    slug: "money",
    category: "Money",
    title: "Budgeting for Dads",
    seoTitle: "Budgeting for Dads: Family Money Guides | Broke Dads Club",
    description:
      "Practical budgeting for dads: grocery weeks, school fees, birthday math, and the dad tax. Systems for tight months without the shame spiral.",
    keywords: [
      "budgeting for dads",
      "family budget for fathers",
      "dad money guides",
      "parenting on a budget",
      "cheap family groceries",
    ],
    headline: "Budgeting for dads who are already doing the math",
    intro: [
      "Most family finance advice assumes a surplus you can park in an index fund and a free Saturday to build a spreadsheet. Real dad budgeting looks more like a kitchen table after bedtime, a grocery cart that keeps rising, and a school fee that was not in the plan.",
      "This hub gathers the Broke Dads Club money guides in one place: how to feed a household on a tight week, how to name the dad tax without collapsing into shame, and how to decide between the car repair and the next bill when both feel urgent.",
      "Start with the guide that matches this week's pressure. Use the printables when you need a fridge-door version. Come back when the season changes. Budgeting here is not a personality upgrade. It is an operating system for months with zero room for error.",
      "If you only have ten minutes, open the $47 grocery week or the dad tax. If August is hitting, start with school supplies and the second bill. If a birthday or sports fee is the fire, use the party math and sports signup guides before you say yes out loud.",
    ],
  },
  {
    slug: "time",
    category: "Time",
    title: "Family Time Management for Dads",
    seoTitle:
      "Family Time Management for Dads | Broke Dads Club",
    description:
      "Family time management for stretched dads: drop one activity, protect bedtime, cheap weekends, date nights, and dad friendship that fits a real calendar.",
    keywords: [
      "family time management",
      "dad time management",
      "overwhelmed dad schedule",
      "dropping kids activities",
      "cheap family weekend ideas",
    ],
    headline: "Family time management when the calendar is full and you are tired",
    intro: [
      "Dad time management is rarely about a prettier planner. It is about deciding what gets a real yes when the week already has school, work, practice, and a kid who will not sleep.",
      "These guides are for the logistics season: how to drop one activity so the week can breathe, how to run a weekend that is not only screens, how to do a cheap date night without staging a production, and how to make one dad friend without building a fantasy league.",
      "The through-line is the same. Protect sleep. Protect one relationship. Shrink the schedule before you add another commitment that looks good on paper and ruins Tuesday.",
      "If the calendar is the problem, start with dropping one activity. If connection is the hole, start with one dad coffee or pickup small talk. If the weekend keeps collapsing, use the cheap weekend and date night guides as a floor, not a performance.",
    ],
  },
  {
    slug: "kids",
    category: "Kids",
    title: "Parenting on a Budget",
    seoTitle: "Parenting on a Budget: Kids Guides for Dads | Broke Dads Club",
    description:
      "Parenting on a budget for dads: money talks without scare tactics, after-school meltdowns, bedtime battles, and explaining we can't go without a speech.",
    keywords: [
      "parenting on a budget",
      "talking to kids about money",
      "after school meltdown",
      "dad parenting tips",
      "explaining no to kids",
    ],
    headline: "Parenting on a budget without turning money into a threat",
    intro: [
      "Parenting on a budget is not about making kids feel poor. It is about giving clear answers, calm routines, and enough structure that a hard no does not become a speech.",
      "This hub covers the kid-facing pressure points Broke Dads Club writes for most: talking about money without scaring them, handling the after-school collapse, bedtime and early risers, and explaining we cannot go when another family just posted the beach.",
      "The goal is dignity for you and for them. Short scripts. Observable cues. A plan for when the first answer does not stick.",
      "If money questions are landing at bedtime, start with talking to kids about money. If pickup is a meltdown, start with the after-school collapse guide. If the hard no is this weekend, use explaining we cannot go and keep the sentence short.",
    ],
  },
];

export function getGuidePillar(slug: string): GuidePillar | null {
  return GUIDE_PILLARS.find((pillar) => pillar.slug === slug) ?? null;
}

export function guideCategoryPath(category: string): string {
  const pillar = GUIDE_PILLARS.find(
    (item) => item.category.toLowerCase() === category.toLowerCase(),
  );
  if (pillar) return `/guides/${pillar.slug}`;
  return `/guides?topic=${encodeURIComponent(category)}`;
}

export function authorBio() {
  return {
    name: site.name,
    line: "Practical guides for dads stretching every dollar and still showing up.",
    aboutHref: "/about",
  };
}
