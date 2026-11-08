import { absoluteUrl } from "@/lib/seo";

/**
 * Site author for bylines and Article JSON-LD.
 * Fill name, bio, photo, and sameAs when ready; placeholders are intentional.
 */
export const siteAuthor = {
  slug: "author",
  /** Replace with your real name. */
  name: "[Your name]",
  /** One-line byline under the name on guide pages. */
  line: "Dad writing practical money and family guides at Broke Dads Club.",
  /** Longer bio on /about/author. */
  bio: [
    "Replace this with a short bio: kids, city or region, and what you budget on.",
    "Keep it plain. Search and readers both care that a real person stands behind the money advice.",
  ],
  /** Path under /public. Swap for a real headshot when you have one. */
  photoSrc: "/brand/club-logo.png",
  photoAlt: "Author photo placeholder",
  /** Profile URLs for sameAs (LinkedIn, X, etc.). Leave empty until real. */
  sameAs: [] as string[],
  path: "/about/author",
} as const;

export function authorBio() {
  return {
    name: siteAuthor.name,
    line: siteAuthor.line,
    aboutHref: siteAuthor.path,
  };
}

export function authorJsonLd() {
  return {
    "@type": "Person" as const,
    name: siteAuthor.name,
    url: absoluteUrl(siteAuthor.path),
    ...(siteAuthor.sameAs.length > 0 ? { sameAs: [...siteAuthor.sameAs] } : {}),
  };
}
