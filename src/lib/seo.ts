import type { Metadata } from "next";
import type { Product } from "@/lib/products";
import type { Resource } from "@/lib/resources";
import { site } from "@/lib/site";

export const OG_IMAGE_PATH = "/opengraph-image";
export const OG_IMAGE = {
  url: OG_IMAGE_PATH,
  width: 1200,
  height: 630,
  alt: site.shareTitle,
} as const;

export const NOINDEX: Metadata = {
  robots: { index: false, follow: false },
};

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  absoluteTitle?: boolean;
  openGraphType?: "website" | "article";
  images?: Array<string | { url: string; width?: number; height?: number; alt?: string }>;
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  absoluteTitle = false,
  openGraphType = "website",
  images,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const resolvedTitle = absoluteTitle ? title : title;
  const ogTitle = absoluteTitle ? title : `${title} · ${site.name}`;
  const ogImages =
    images?.map((image) =>
      typeof image === "string"
        ? { url: image, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: ogTitle }
        : image,
    ) ?? [OG_IMAGE];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: site.name,
      type: openGraphType,
      locale: "en_US",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: ogImages.map((image) => image.url),
    },
  };
}

const BRAND_SUFFIX = /\s*[|·:-]\s*Broke Dads Club\s*$/i;
const META_DESCRIPTION_MAX = 160;

/** "[Guide Title] | Broke Dads Club", without doubling a suffix already in frontmatter. */
export function guideMetaTitle(guide: { title: string; seoTitle?: string }) {
  const base = (guide.seoTitle || guide.title).replace(BRAND_SUFFIX, "").trim();
  return `${base} | ${site.name}`;
}

/** Frontmatter description (excerpt fallback), capped at 160 chars on a word boundary. */
export function guideMetaDescription(guide: { description?: string; excerpt?: string }) {
  const text = (guide.description || guide.excerpt || site.description)
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= META_DESCRIPTION_MAX) return text;
  const cut = text.slice(0, META_DESCRIPTION_MAX - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.]$/, "")}…`;
}

export function resourcePageMetadata(resource: Resource): Metadata {
  return buildPageMetadata({
    title: `${resource.seoTitle} | ${site.name}`,
    description: resource.description,
    path: `/resources/${resource.slug}`,
    keywords: resource.keywords,
    absoluteTitle: true,
  });
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/brand/club-logo.png`,
    email: site.email,
    description: site.description,
    sameAs: site.social.map((item) => item.href),
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.shareDescription,
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: `${site.url}/brand/club-logo.png`,
    },
  };
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image
      ? [product.image]
      : [`${site.url}/brand/club-logo.png`],
    brand: {
      "@type": "Brand",
      name: site.name,
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/shop/${product.slug}`),
      priceCurrency: "USD",
      price: (product.price_cents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: site.name,
      },
    },
  };
}

export function resourceWebPageJsonLd(resource: Resource) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: resource.title,
    description: resource.description,
    url: absoluteUrl(`/resources/${resource.slug}`),
    isAccessibleForFree: true,
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
  };
}
