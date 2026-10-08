import {
  GROCERY_RESET_TRUNK_KIT_TITLE,
  buildGroceryResetTrunkKitPdf,
} from "@/lib/lead-magnets/grocery-reset-trunk-kit-pdf";

export type LeadMagnet = {
  slug: string;
  title: string;
  /** Name the browser saves the download as. */
  fileName: string;
  /** Stored on the subscriber row so signups can be attributed. */
  source: string;
  build: () => Promise<Uint8Array>;
};

export const LEAD_MAGNETS: Record<string, LeadMagnet> = {
  "grocery-reset-trunk-kit": {
    slug: "grocery-reset-trunk-kit",
    title: GROCERY_RESET_TRUNK_KIT_TITLE,
    fileName: "broke-dads-club-47-grocery-reset-trunk-kit.pdf",
    source: "lead_magnet_grocery_reset_trunk_kit",
    build: buildGroceryResetTrunkKitPdf,
  },
};

export function getLeadMagnet(slug: string): LeadMagnet | null {
  return Object.hasOwn(LEAD_MAGNETS, slug) ? LEAD_MAGNETS[slug] : null;
}

const pdfCache = new Map<string, Promise<Uint8Array>>();

/** PDFs are static per deploy, so build once per server instance. */
export function getLeadMagnetPdf(magnet: LeadMagnet): Promise<Uint8Array> {
  let pending = pdfCache.get(magnet.slug);
  if (!pending) {
    pending = magnet.build().catch((error: unknown) => {
      pdfCache.delete(magnet.slug);
      throw error;
    });
    pdfCache.set(magnet.slug, pending);
  }
  return pending;
}
