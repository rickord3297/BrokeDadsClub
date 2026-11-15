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
import type { DealItem } from "@/lib/newsletter-model";

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
    return merchant === "amazon" && isAsin(raw) ? amazonUrl(raw) : buildAffiliateUrl(raw, merchant);
  } catch (error) {
    throw new AffiliateLinkError(`${where}: ${(error as Error).message}`);
  }
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
    return [
      {
        title: row.title.trim(),
        merchant,
        targetPrice: targetPrice.trim(),
        note: row.note.trim(),
        url,
        ...(asin ? { asin } : {}),
        ...(price ? { price } : {}),
        ...(wasPrice ? { wasPrice } : {}),
        ...(discountPercent ? { discountPercent } : {}),
      },
    ];
  });
}

/** Pull a 10-char ASIN from common Amazon product URL shapes. */
export function extractAsinFromUrl(rawUrl: string): string | undefined {
  try {
    const url = new URL(rawUrl);
    const fromPath =
      url.pathname.match(/\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})(?:[/?]|$)/i) ??
      url.pathname.match(/\/([A-Z0-9]{10})(?:[/?]|$)/i);
    return fromPath?.[1]?.toUpperCase();
  } catch {
    return undefined;
  }
}
