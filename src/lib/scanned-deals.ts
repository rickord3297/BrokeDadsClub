import { createAdminClient } from "@/lib/supabase/admin";
import {
  searchDiscountedAmazonItems,
  type ScannedAmazonDeal,
} from "@/lib/amazon-creators";
import type { DealItem } from "@/lib/newsletter-model";

export type ScannedDealRow = {
  asin: string;
  title: string;
  url: string;
  merchant: "amazon";
  price: string;
  was_price: string;
  discount_percent: number;
  price_cents: number;
  was_price_cents: number;
  note: string;
  image_url: string | null;
  keyword: string;
  checked_at: string;
};

function noteFor(deal: ScannedAmazonDeal): string {
  return `Live Amazon markdown when we scanned (${deal.discountPercent}% off vs ${deal.wasPrice}). Keyword: ${deal.keyword}. Prices move; check before you buy.`;
}

export function scannedRowToDealItem(row: ScannedDealRow): DealItem {
  return {
    title: row.title,
    merchant: "amazon",
    targetPrice: row.price,
    note: row.note,
    url: row.url,
    asin: row.asin,
    price: row.price,
    wasPrice: row.was_price,
    discountPercent: row.discount_percent,
  };
}

/** Active scanned deals, highest discount first. */
export async function getScannedDeals(limit = 24): Promise<DealItem[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("scanned_deals")
    .select(
      "asin, title, url, merchant, price, was_price, discount_percent, price_cents, was_price_cents, note, image_url, keyword, checked_at",
    )
    .gt("discount_percent", 0)
    .order("discount_percent", { ascending: false })
    .order("checked_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Could not load scanned_deals:", error.message);
    return [];
  }

  return ((data ?? []) as ScannedDealRow[]).map(scannedRowToDealItem);
}

/** Replace the live board with a fresh Amazon discount scan. */
export async function refreshScannedDeals(): Promise<{
  ok: boolean;
  message: string;
  count: number;
}> {
  const admin = createAdminClient();
  if (!admin) {
    return { ok: false, message: "Supabase admin client is not configured.", count: 0 };
  }

  let deals: ScannedAmazonDeal[];
  try {
    deals = await searchDiscountedAmazonItems();
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Amazon scan failed.",
      count: 0,
    };
  }

  if (deals.length === 0) {
    return {
      ok: true,
      message:
        "Scan returned no discounted items. Check Creators API credentials and Associates eligibility (10 sales in 30 days).",
      count: 0,
    };
  }

  const checkedAt = new Date().toISOString();
  const rows = deals.map((deal) => ({
    asin: deal.asin,
    title: deal.title,
    url: deal.url,
    merchant: "amazon",
    price: deal.price,
    was_price: deal.wasPrice,
    discount_percent: deal.discountPercent,
    price_cents: deal.priceCents,
    was_price_cents: deal.wasPriceCents,
    note: noteFor(deal),
    image_url: deal.imageUrl,
    keyword: deal.keyword,
    checked_at: checkedAt,
  }));

  const { error: clearError } = await admin
    .from("scanned_deals")
    .delete()
    .neq("asin", "");
  if (clearError) {
    return { ok: false, message: `Could not clear old scans: ${clearError.message}`, count: 0 };
  }

  const { error: insertError } = await admin.from("scanned_deals").insert(rows);
  if (insertError) {
    return { ok: false, message: `Could not save scans: ${insertError.message}`, count: 0 };
  }

  return {
    ok: true,
    message: `Saved ${rows.length} discounted Amazon items.`,
    count: rows.length,
  };
}
