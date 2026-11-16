import {
  APPROVED_MERCHANTS,
  AFFILIATE_CONFIG,
  AffiliateLinkError,
  amazonUrl,
  buildAffiliateUrl,
  findApprovedMerchant,
  isAsin,
  type ApprovedMerchant,
} from "@/lib/affiliate";
import {
  DEAL_SECTIONS,
  type DealItem,
  type DealSection,
} from "@/lib/newsletter-model";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseMerchant(value: unknown, where: string): ApprovedMerchant {
  const merchant = typeof value === "string" ? findApprovedMerchant(value) : null;
  if (!merchant) {
    const allowed = APPROVED_MERCHANTS.map((id) => AFFILIATE_CONFIG[id].name).join(", ");
    throw new AffiliateLinkError(
      `${where}: merchant "${String(value)}" is not an approved affiliate merchant (allowed: ${allowed}).`,
    );
  }
  return merchant;
}

function resolveDealUrl(raw: string, merchant: ApprovedMerchant, where: string): string {
  try {
    if (merchant === "house") {
      const path = raw.trim().startsWith("/")
        ? `https://brokedadsclub.com${raw.trim()}`
        : raw.trim();
      return buildAffiliateUrl(path, merchant);
    }
    return merchant === "amazon" && isAsin(raw) ? amazonUrl(raw) : buildAffiliateUrl(raw, merchant);
  } catch (error) {
    throw new AffiliateLinkError(`${where}: ${(error as Error).message}`);
  }
}

function parseSection(value: unknown): DealSection {
  if (typeof value === "string") {
    const match = DEAL_SECTIONS.find((section) => section === value.trim().toLowerCase());
    if (match) return match;
  }
  return "always";
}

function parseOptionalDate(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (isNonEmptyString(value) && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    return value.trim();
  }
  return undefined;
}

/**
 * Shared deal parser for newsletter issues and the /deals board.
 * Merchant/link problems throw so an unmonetized link cannot ship.
 */
export function parseDealItems(value: unknown, wherePrefix: string): DealItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const where = `${wherePrefix}, deal #${index + 1}`;
    const targetPrice =
      typeof row.targetPrice === "number" ? String(row.targetPrice) : row.targetPrice;
    if (
      !isNonEmptyString(row.title) ||
      !isNonEmptyString(targetPrice) ||
      typeof row.note !== "string" ||
      !isNonEmptyString(row.url)
    ) {
      console.error(`Skipping invalid deal #${index + 1} in ${wherePrefix}`);
      return [];
    }
    const merchant = parseMerchant(row.merchant, where);
    const url = resolveDealUrl(row.url, merchant, where);
    const asin =
      isNonEmptyString(row.asin) && /^[A-Z0-9]{10}$/i.test(row.asin.trim())
        ? row.asin.trim().toUpperCase()
        : extractAsinFromUrl(url);
    const price = isNonEmptyString(row.price) ? row.price.trim() : undefined;
    const wasPrice = isNonEmptyString(row.wasPrice) ? row.wasPrice.trim() : undefined;
    const discountRaw =
      typeof row.discountPercent === "number"
        ? row.discountPercent
        : isNonEmptyString(row.discountPercent)
          ? Number(row.discountPercent)
          : NaN;
    const discountPercent =
      Number.isFinite(discountRaw) && discountRaw > 0 ? Math.round(discountRaw) : undefined;
    const math = isNonEmptyString(row.math) ? row.math.trim() : undefined;
    const whyThis = isNonEmptyString(row.whyThis) ? row.whyThis.trim() : undefined;
    const lastChecked = parseOptionalDate(row.lastChecked);
    const section = parseSection(row.section);
    const sectionLabel = isNonEmptyString(row.sectionLabel)
      ? row.sectionLabel.trim()
      : undefined;

    if (merchant === "amazon" && !asin) {
      console.error(
        `${where}: Amazon deal "${row.title}" should use a product ASIN/dp URL, not a search page.`,
      );
    }

    return [
      {
        title: row.title.trim(),
        merchant,
        targetPrice: targetPrice.trim(),
        note: row.note.trim(),
        url,
        section,
        ...(asin ? { asin } : {}),
        ...(price ? { price } : {}),
        ...(wasPrice ? { wasPrice } : {}),
        ...(discountPercent ? { discountPercent } : {}),
        ...(math ? { math } : {}),
        ...(whyThis ? { whyThis } : {}),
        ...(lastChecked ? { lastChecked } : {}),
        ...(sectionLabel ? { sectionLabel } : {}),
      },
    ];
  });
}

/** Pull a 10-char ASIN from common Amazon product URL shapes. */
export function extractAsinFromUrl(rawUrl: string): string | undefined {
  try {
    const url = new URL(rawUrl);
    const fromPath = url.pathname.match(
      /\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})(?:[/?]|$)/i,
    );
    return fromPath?.[1]?.toUpperCase();
  } catch {
    return undefined;
  }
}
