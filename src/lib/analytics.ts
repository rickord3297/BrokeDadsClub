"use client";

import { track } from "@vercel/analytics/react";
import {
  trackMetaAddToCart,
  trackMetaInitiateCheckout,
  trackMetaLead,
} from "@/lib/meta-pixel";

type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

function send(name: string, properties?: AnalyticsProps) {
  track(name, properties);
}

export function trackGuideView(slug: string, category: string) {
  send("guide_view", { slug, category });
}

export function trackGuideClick(slug: string, placement: string) {
  send("guide_click", { slug, placement });
}

export function trackGuideShare(slug: string, method: "native" | "copy") {
  send("guide_share", { slug, method });
}

export function trackGuideFeedback(slug: string, vote: "up" | "down") {
  send("guide_feedback", { slug, vote });
}

export function trackGuideSearch(queryLength: number) {
  send("guide_search", { query_length: queryLength });
}

export function trackTopicFilter(topic: string, placement: string) {
  send("topic_filter", { topic: topic || "all", placement });
}

export function trackReadingMilestone(
  slug: string,
  percent: 25 | 50 | 75 | 100,
) {
  send("reading_milestone", { slug, percent });
}

/** Forms that redirect to /thank-you pass metaLead: false; that page fires the Lead so it counts once. */
export function trackEmailSignup(source: string, { metaLead = true }: { metaLead?: boolean } = {}) {
  send("email_signup", { source });
  if (metaLead) trackMetaLead(source);
}

export function trackWelcomeBack(kind: "guide" | "newsletter", slug: string) {
  send("welcome_back_shown", { kind, slug });
}

export function trackLeadMagnetDownload(slug: string) {
  send("lead_magnet_download", { slug });
}

export function trackPrintableView(slug: string) {
  send("printable_view", { slug });
}

export function trackPrintablePrint(slug: string) {
  send("printable_print", { slug });
}

export function trackShopAddToCart(slug: string, priceCents?: number) {
  send("shop_add_to_cart", { slug });
  trackMetaAddToCart({ slug, priceCents });
}

export function trackCheckoutStart(itemCount: number, subtotalCents: number) {
  send("checkout_start", { item_count: itemCount, subtotal_cents: subtotalCents });
  trackMetaInitiateCheckout({ valueCents: subtotalCents, itemCount });
}

export function trackStartHereClick(target: string) {
  send("start_here_click", { target });
}
