declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1532513065296379";

function fbq(...args: unknown[]) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq(...args);
}

export function trackMetaPageView() {
  fbq("track", "PageView");
}

export function trackMetaAddToCart(input: {
  slug: string;
  priceCents?: number;
}) {
  fbq("track", "AddToCart", {
    content_ids: [input.slug],
    content_type: "product",
    value: input.priceCents ? input.priceCents / 100 : undefined,
    currency: "USD",
  });
}

export function trackMetaInitiateCheckout(input: {
  valueCents: number;
  itemCount: number;
}) {
  fbq("track", "InitiateCheckout", {
    value: input.valueCents / 100,
    currency: "USD",
    num_items: input.itemCount,
  });
}

export function trackMetaPurchase(input: {
  value: number;
  currency: string;
}) {
  fbq("track", "Purchase", {
    value: input.value,
    currency: input.currency,
  });
}
