export const AMAZON_ASSOCIATE_TAG = "brokedadsclub-20";

/** Verbatim text required by the Amazon Associates Operating Agreement. */
export const AMAZON_DISCLOSURE = "As an Amazon Associate I earn from qualifying purchases.";

const ASIN_PATTERN = /^[A-Z0-9]{10}$/i;

/** Amazon retail storefronts. Short links (amzn.to) are excluded: they redirect and drop added params. */
const AMAZON_HOST_PATTERN =
  /(^|\.)amazon\.(com|ca|com\.mx|com\.br|co\.uk|de|fr|it|es|nl|se|pl|com\.be|ie|in|co\.jp|com\.au|sg|ae|sa|com\.tr|eg)$/i;

export function isAsin(value: string): boolean {
  return ASIN_PATTERN.test(value.trim());
}

function parseUrl(value: string): URL | null {
  const trimmed = value.trim();
  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

export function isAmazonUrl(value: string): boolean {
  const url = parseUrl(value);
  return url != null && AMAZON_HOST_PATTERN.test(url.hostname);
}

/**
 * Amazon product link carrying our Associate tag.
 *
 * Accepts a 10-character ASIN or any Amazon storefront URL (with or without
 * protocol). Existing query params are kept; any existing `tag` is replaced so
 * the link credits this site. Throws on anything else so bad links fail loudly.
 */
export function amazonUrl(asinOrUrl: string): string {
  const input = asinOrUrl.trim();

  if (isAsin(input)) {
    const url = new URL(`https://www.amazon.com/dp/${input.toUpperCase()}`);
    url.searchParams.set("tag", AMAZON_ASSOCIATE_TAG);
    return url.toString();
  }

  const url = parseUrl(input);
  if (!url || !AMAZON_HOST_PATTERN.test(url.hostname)) {
    throw new Error(`amazonUrl: expected an ASIN or Amazon URL, got "${asinOrUrl}"`);
  }

  url.protocol = "https:";
  url.searchParams.set("tag", AMAZON_ASSOCIATE_TAG);
  return url.toString();
}

/** Tags Amazon links and ASINs; returns any other http(s) URL unchanged, or null if invalid. */
export function withAffiliateTag(asinOrUrl: string): string | null {
  if (isAsin(asinOrUrl) || isAmazonUrl(asinOrUrl)) return amazonUrl(asinOrUrl);
  const url = parseUrl(asinOrUrl);
  return url && /^https?:\/\//i.test(asinOrUrl.trim()) ? url.toString() : null;
}
