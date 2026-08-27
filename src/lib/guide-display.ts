import type { GuideFaq } from "@/lib/guides";

export type CategoryDisplay = {
  glyph: string;
  stripe: string;
  panel: string;
  badge: string;
  badgeText: string;
};

const CATEGORY_DISPLAY: Record<string, CategoryDisplay> = {
  Money: {
    glyph: "$",
    stripe: "from-gold/35 via-rust/20 to-transparent",
    panel: "bg-gold/12",
    badge: "bg-gold/20 text-rust-2",
    badgeText: "text-rust-2",
  },
  Time: {
    glyph: "T",
    stripe: "from-pine/30 via-pine/10 to-transparent",
    panel: "bg-pine/10",
    badge: "bg-pine/15 text-pine",
    badgeText: "text-pine",
  },
  Kids: {
    glyph: "K",
    stripe: "from-rust/25 via-gold/15 to-transparent",
    panel: "bg-rust/10",
    badge: "bg-rust/15 text-rust-2",
    badgeText: "text-rust-2",
  },
  Work: {
    glyph: "W",
    stripe: "from-ink/15 via-pine/10 to-transparent",
    panel: "bg-paper-2",
    badge: "bg-ink/8 text-ink",
    badgeText: "text-ink-soft",
  },
  Gear: {
    glyph: "G",
    stripe: "from-pine/20 via-gold/15 to-transparent",
    panel: "bg-paper-2",
    badge: "bg-pine/12 text-pine",
    badgeText: "text-pine",
  },
};

const FALLBACK_DISPLAY: CategoryDisplay = {
  glyph: "•",
  stripe: "from-pine/20 to-transparent",
  panel: "bg-paper-2",
  badge: "bg-pine/10 text-pine",
  badgeText: "text-pine",
};

export function getCategoryDisplay(category: string): CategoryDisplay {
  return CATEGORY_DISPLAY[category] ?? FALLBACK_DISPLAY;
}

export function takeawaysFromFaq(faq: GuideFaq[], limit = 2): string[] {
  return faq.slice(0, limit).flatMap((item) => {
    const text = item.answer.trim();
    if (!text) return [];
    const firstSentence = text.split(/(?<=[.!?])\s+/)[0]?.trim() ?? text;
    return [firstSentence.length > 120 ? `${firstSentence.slice(0, 117)}…` : firstSentence];
  });
}

export function categoryCounts<T extends { category: string }>(
  guides: T[],
): Record<string, number> {
  return guides.reduce<Record<string, number>>((counts, guide) => {
    counts[guide.category] = (counts[guide.category] ?? 0) + 1;
    return counts;
  }, {});
}
