import { ORGANIZATION_ID, absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * Site author for bylines, guide footers, /about/author, and Article JSON-LD.
 * Cord Elmore is a pen name. sameAs stays empty until public profiles exist.
 */
export const siteAuthor = {
  slug: "author",
  name: "Cord Elmore",
  jobTitle: "Founder and writer, Broke Dads Club",
  /** Short bio for the bottom of each guide + Person.description. */
  shortBio:
    "Cord Elmore is a Chicago-area dad of two young kids who works a desk job and writes Broke Dads Club. He does the math on groceries, school fees, and family weekends so you can make the call and get back to bedtime.",
  /** Path under /public. Swap for a real headshot when you have one. */
  photoSrc: "/brand/club-logo.png",
  photoAlt: "Cord Elmore, founder of Broke Dads Club",
  /** Profile URLs for sameAs. Leave empty until social accounts exist under this name. */
  sameAs: [] as string[],
  path: "/about/author",
} as const;

export function authorBio() {
  return {
    name: siteAuthor.name,
    line: siteAuthor.shortBio,
    aboutHref: siteAuthor.path,
  };
}

export function authorJsonLd() {
  return {
    "@type": "Person" as const,
    name: siteAuthor.name,
    jobTitle: siteAuthor.jobTitle,
    description: siteAuthor.shortBio,
    url: absoluteUrl(siteAuthor.path),
    ...(siteAuthor.sameAs.length > 0 ? { sameAs: [...siteAuthor.sameAs] } : {}),
  };
}

export function authorPageJsonLd() {
  return {
    "@context": "https://schema.org",
    ...authorJsonLd(),
    image: `${site.url}${siteAuthor.photoSrc}`,
    worksFor: { "@id": ORGANIZATION_ID },
  };
}
