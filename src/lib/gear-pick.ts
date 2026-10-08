import {
  AffiliateLinkError,
  buildAffiliateUrl,
  findApprovedMerchant,
  type ApprovedMerchant,
} from "@/lib/affiliate";

export const GEAR_PICK_VERDICTS = ["essential", "wait", "skip"] as const;
export type GearPickVerdict = (typeof GEAR_PICK_VERDICTS)[number];

export type GearPick = {
  title: string;
  /** Display-ready target, e.g. "Under $15". */
  targetPrice: string;
  tip: string;
  verdict: GearPickVerdict;
  /** Optional badge text replacing the verdict's default ("Essential", "Buy later", "Skip it"). */
  label: string;
  /** Present only when the pick links out. Skips usually don't. */
  link: { url: string; merchant: ApprovedMerchant } | null;
};

/**
 * Parses a ```gear-pick fenced block from guide markdown: one `key: value` per line.
 * Keys: title, targetPrice, tip, verdict (essential | wait | skip), label, merchant, url.
 * Link problems throw so an unapproved or untagged link fails the build.
 */
export function parseGearPick(source: string, where = "gear-pick block"): GearPick {
  const fields = new Map<string, string>();
  for (const line of source.split("\n")) {
    const match = line.match(/^\s*([A-Za-z]+)\s*:\s*(.*)$/);
    if (match) fields.set(match[1].toLowerCase(), match[2].trim().replace(/^(["'])(.*)\1$/, "$2"));
  }

  const title = fields.get("title") ?? "";
  const targetPrice = fields.get("targetprice") ?? "";
  if (!title || !targetPrice) {
    throw new Error(`${where}: needs at least title and targetPrice.`);
  }

  const verdictRaw = (fields.get("verdict") ?? "essential").toLowerCase();
  const verdict = GEAR_PICK_VERDICTS.find((option) => option === verdictRaw);
  if (!verdict) {
    throw new Error(`${where}: verdict must be one of ${GEAR_PICK_VERDICTS.join(", ")}.`);
  }

  const url = fields.get("url");
  let link: GearPick["link"] = null;
  if (url) {
    const merchant = findApprovedMerchant(fields.get("merchant") ?? "");
    if (!merchant) {
      throw new AffiliateLinkError(`${where}: "${title}" needs an approved merchant for its link.`);
    }
    try {
      link = { url: buildAffiliateUrl(url, merchant), merchant };
    } catch (error) {
      throw new AffiliateLinkError(`${where}: ${(error as Error).message}`);
    }
  }

  return { title, targetPrice, tip: fields.get("tip") ?? "", verdict, label: fields.get("label") ?? "", link };
}
