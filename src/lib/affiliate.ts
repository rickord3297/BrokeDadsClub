type MerchantConfig = {
  id: string;
  name: string;
  tag: string;
  /** Query param that carries the tag. */
  tagParam: string;
  /** Hostnames that belong to this merchant. Subdomains match too. */
  domains: readonly string[];
  /** Short links minted in the merchant's dashboard already carry the tag, and their redirect drops added params, so they pass through untouched. */
  shortLinkDomains: readonly string[];
  /** Disclosure shown wherever this merchant's links appear. */
  disclosure: string;
  enabled: boolean;
};

/**
 * Approved affiliate merchants. Only enabled merchants can appear in deals;
 * any other link fails the build instead of shipping unmonetized traffic.
 */
export const AFFILIATE_CONFIG = {
  amazon: {
    id: "amazon",
    name: "Amazon",
    tag: "brokedadsclub-20",
    tagParam: "tag",
    // The tag is a US Associates ID, so other Amazon storefronts would not pay out.
    domains: ["amazon.com", "www.amazon.com", "amzn.to"],
    shortLinkDomains: ["amzn.to"],
    // Verbatim text required by the Amazon Associates Operating Agreement.
    disclosure: "As an Amazon Associate I earn from qualifying purchases.",
    enabled: true,
  },
  // Future networks can be toggled on here (e.g. Home Depot, Target):
  // homedepot: { id: "homedepot", name: "The Home Depot", tag: "...", tagParam: "...", domains: ["homedepot.com"], shortLinkDomains: [], disclosure: "...", enabled: false },
} as const satisfies Record<string, MerchantConfig>;

export type AffiliateMerchantId = keyof typeof AFFILIATE_CONFIG;

/** Merchants with `enabled: true`. Disabled merchants are not assignable. */
export type ApprovedMerchant = {
  [K in AffiliateMerchantId]: (typeof AFFILIATE_CONFIG)[K]["enabled"] extends true ? K : never;
}[AffiliateMerchantId];

export const APPROVED_MERCHANTS = (Object.keys(AFFILIATE_CONFIG) as AffiliateMerchantId[]).filter(
  (id) => AFFILIATE_CONFIG[id].enabled,
) as ApprovedMerchant[];

export const AMAZON_ASSOCIATE_TAG = AFFILIATE_CONFIG.amazon.tag;
export const AMAZON_DISCLOSURE = AFFILIATE_CONFIG.amazon.disclosure;

export class AffiliateLinkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AffiliateLinkError";
  }
}

export function isApprovedMerchant(value: string): value is ApprovedMerchant {
  return (APPROVED_MERCHANTS as string[]).includes(value);
}

/** Matches a merchant by id ("amazon") or display name ("Amazon"), case-insensitive. */
export function findApprovedMerchant(value: string): ApprovedMerchant | null {
  const needle = value.trim().toLowerCase();
  return (
    APPROVED_MERCHANTS.find(
      (id) => id === needle || AFFILIATE_CONFIG[id].name.toLowerCase() === needle,
    ) ?? null
  );
}

export function merchantName(merchant: ApprovedMerchant): string {
  return AFFILIATE_CONFIG[merchant].name;
}

/** One disclosure per merchant present, in first-seen order. */
export function merchantDisclosures(merchants: Iterable<ApprovedMerchant>): string[] {
  return [...new Set([...merchants].map((id) => AFFILIATE_CONFIG[id].disclosure))];
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

function hostMatches(hostname: string, domains: readonly string[]): boolean {
  const host = hostname.toLowerCase();
  return domains.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

/**
 * Tracked link for an approved merchant. Forces https, keeps existing params,
 * and sets the merchant's tag (replacing any other tag). Throws on disabled
 * merchants, invalid URLs, or hosts outside the merchant's domains.
 */
export function buildAffiliateUrl(rawUrl: string, merchant: ApprovedMerchant): string {
  const config: MerchantConfig = AFFILIATE_CONFIG[merchant];
  if (!config?.enabled) {
    throw new AffiliateLinkError(`Merchant "${merchant}" is not an approved affiliate merchant.`);
  }

  const url = parseUrl(rawUrl);
  if (!url) {
    throw new AffiliateLinkError(`Invalid ${config.name} link: "${rawUrl}"`);
  }
  if (!hostMatches(url.hostname, config.domains)) {
    throw new AffiliateLinkError(
      `"${url.hostname}" is not an approved ${config.name} domain (allowed: ${config.domains.join(", ")}).`,
    );
  }

  url.protocol = "https:";
  if (!hostMatches(url.hostname, config.shortLinkDomains)) {
    url.searchParams.set(config.tagParam, config.tag);
  }
  return url.toString();
}

const ASIN_PATTERN = /^[A-Z0-9]{10}$/i;

export function isAsin(value: string): boolean {
  return ASIN_PATTERN.test(value.trim());
}

export function isAmazonUrl(value: string): boolean {
  const url = parseUrl(value);
  return url != null && hostMatches(url.hostname, AFFILIATE_CONFIG.amazon.domains);
}

/** Tagged Amazon link from a 10-character ASIN or an amazon.com URL. Throws on anything else. */
export function amazonUrl(asinOrUrl: string): string {
  const input = asinOrUrl.trim();
  return buildAffiliateUrl(
    isAsin(input) ? `https://www.amazon.com/dp/${input.toUpperCase()}` : input,
    "amazon",
  );
}
