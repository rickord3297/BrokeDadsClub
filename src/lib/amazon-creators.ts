import { AMAZON_ASSOCIATE_TAG, amazonUrl } from "@/lib/affiliate";

const MARKETPLACE = "www.amazon.com";
const TOKEN_ENDPOINTS: Record<string, string> = {
  "3.1": "https://api.amazon.com/auth/o2/token",
  "3.2": "https://api.amazon.co.uk/auth/o2/token",
  "3.3": "https://api.amazon.co.jp/auth/o2/token",
};

type TokenCache = { accessToken: string; expiresAt: number };
let tokenCache: TokenCache | null = null;

export type ScannedAmazonDeal = {
  asin: string;
  title: string;
  url: string;
  price: string;
  wasPrice: string;
  discountPercent: number;
  priceCents: number;
  wasPriceCents: number;
  imageUrl: string | null;
  keyword: string;
};

function creatorsConfig() {
  const credentialId = process.env.AMAZON_CREATORS_CREDENTIAL_ID?.trim();
  const credentialSecret = process.env.AMAZON_CREATORS_CREDENTIAL_SECRET?.trim();
  const version = process.env.AMAZON_CREATORS_CREDENTIAL_VERSION?.trim() || "3.1";
  const partnerTag =
    process.env.AMAZON_CREATORS_PARTNER_TAG?.trim() || AMAZON_ASSOCIATE_TAG;
  if (!credentialId || !credentialSecret) return null;
  const tokenUrl = TOKEN_ENDPOINTS[version];
  if (!tokenUrl) return null;
  return { credentialId, credentialSecret, version, partnerTag, tokenUrl };
}

export function isAmazonCreatorsConfigured(): boolean {
  return creatorsConfig() != null;
}

async function getAccessToken(): Promise<string> {
  const config = creatorsConfig();
  if (!config) throw new Error("Amazon Creators API is not configured.");
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.accessToken;
  }

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: config.credentialId,
      client_secret: config.credentialSecret,
      scope: "creatorsapi::default",
    }),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Creators token failed (${response.status}): ${body.slice(0, 200)}`);
  }
  const payload = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!payload.access_token) throw new Error("Creators token response missing access_token.");
  tokenCache = {
    accessToken: payload.access_token,
    expiresAt: Date.now() + (payload.expires_in ?? 3600) * 1000,
  };
  return payload.access_token;
}

async function creatorsPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const config = creatorsConfig();
  if (!config) throw new Error("Amazon Creators API is not configured.");
  const token = await getAccessToken();
  const response = await fetch(`https://creatorsapi.amazon/catalog/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-marketplace": MARKETPLACE,
    },
    body: JSON.stringify({
      ...body,
      marketplace: MARKETPLACE,
      partnerTag: config.partnerTag,
    }),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Creators ${path} failed (${response.status}): ${text.slice(0, 300)}`);
  }
  return (await response.json()) as T;
}

type Money = { amount?: number; displayAmount?: string };
type OfferPrice = {
  money?: Money;
  savingBasis?: { money?: Money };
  savings?: { money?: Money; percentage?: number };
};
type SearchItem = {
  asin?: string;
  detailPageURL?: string;
  itemInfo?: { title?: { displayValue?: string } };
  images?: { primary?: { medium?: { url?: string }; large?: { url?: string } } };
  offersV2?: { listings?: Array<{ price?: OfferPrice }> };
};

function moneyDisplay(money?: Money): string | null {
  if (!money) return null;
  if (money.displayAmount?.trim()) return money.displayAmount.trim();
  if (typeof money.amount === "number") return `$${money.amount.toFixed(2)}`;
  return null;
}

function moneyCents(money?: Money): number | null {
  if (typeof money?.amount !== "number" || !Number.isFinite(money.amount)) return null;
  return Math.round(money.amount * 100);
}

function parseSearchItem(item: SearchItem, keyword: string): ScannedAmazonDeal | null {
  const asin = item.asin?.trim().toUpperCase();
  const title = item.itemInfo?.title?.displayValue?.trim();
  const listing = item.offersV2?.listings?.[0]?.price;
  const price = moneyDisplay(listing?.money);
  const wasPrice = moneyDisplay(listing?.savingBasis?.money);
  const priceCents = moneyCents(listing?.money);
  const wasPriceCents = moneyCents(listing?.savingBasis?.money);
  const discountPercent =
    typeof listing?.savings?.percentage === "number"
      ? Math.round(listing.savings.percentage)
      : wasPriceCents && priceCents && wasPriceCents > priceCents
        ? Math.round(((wasPriceCents - priceCents) / wasPriceCents) * 100)
        : null;

  if (!asin || !title || !price || !wasPrice || !priceCents || !wasPriceCents) return null;
  if (!discountPercent || discountPercent < 1) return null;

  return {
    asin,
    title,
    url: amazonUrl(asin),
    price,
    wasPrice,
    discountPercent,
    priceCents,
    wasPriceCents,
    imageUrl:
      item.images?.primary?.medium?.url?.trim() ||
      item.images?.primary?.large?.url?.trim() ||
      null,
    keyword,
  };
}

/** Dad-household search seeds. Each run asks Amazon for items already marked down. */
export const DEAL_SCAN_KEYWORDS = [
  "kids soft sided lunch box",
  "reusable ice packs kids lunch",
  "basic first aid kit home",
  "kids water bottle school",
  "insulated lunch bag kids",
  "pie carrier insulated",
  "bandaids bulk family",
  "school backpack kids",
] as const;

/**
 * Search Amazon for products with a real markdown (minSavingPercent).
 * Requires Creators API credentials and Associates eligibility (10 sales / 30 days).
 */
export async function searchDiscountedAmazonItems(input?: {
  keywords?: readonly string[];
  minSavingPercent?: number;
  maxPriceCents?: number;
  itemCount?: number;
}): Promise<ScannedAmazonDeal[]> {
  if (!isAmazonCreatorsConfigured()) return [];

  const keywords = input?.keywords ?? DEAL_SCAN_KEYWORDS;
  const minSavingPercent = input?.minSavingPercent ?? 20;
  const maxPriceCents = input?.maxPriceCents ?? 5000;
  const itemCount = Math.min(10, Math.max(1, input?.itemCount ?? 5));
  const found = new Map<string, ScannedAmazonDeal>();

  for (const keyword of keywords) {
    try {
      const payload = await creatorsPost<{
        searchResult?: { items?: SearchItem[] };
        itemsResult?: { items?: SearchItem[] };
      }>("searchItems", {
        keywords: keyword,
        itemCount,
        itemPage: 1,
        minSavingPercent,
        maxPrice: maxPriceCents,
        condition: "New",
        resources: [
          "images.primary.medium",
          "itemInfo.title",
          "offersV2.listings.price",
        ],
      });
      const items = payload.searchResult?.items ?? payload.itemsResult?.items ?? [];
      for (const item of items) {
        const deal = parseSearchItem(item, keyword);
        if (!deal) continue;
        const existing = found.get(deal.asin);
        if (!existing || deal.discountPercent > existing.discountPercent) {
          found.set(deal.asin, deal);
        }
      }
    } catch (error) {
      console.error(`Deal scan failed for "${keyword}":`, error);
    }
  }

  return [...found.values()].sort((a, b) => b.discountPercent - a.discountPercent);
}
