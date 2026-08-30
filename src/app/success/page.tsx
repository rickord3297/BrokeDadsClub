import type { Metadata } from "next";
import Link from "next/link";
import { ClearCartOnSuccess } from "@/components/clear-cart-on-success";
import { PurchaseTracker } from "@/components/purchase-tracker";

export const metadata: Metadata = {
  title: "Order received",
};

export default function SuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <ClearCartOnSuccess />
      <PurchaseTracker />
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Thank you</p>
      <h1 className="mt-3 font-display text-5xl">You&apos;re in the club.</h1>
      <p className="mt-5 text-lg leading-8 text-ink-soft">
        Stripe has the payment. We&apos;ll email a receipt. Wear it like you meant
        the grocery-store parking lot to be a runway.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/guides/the-second-bill"
          className="rounded-full bg-pine px-5 py-3 text-sm font-semibold text-paper"
        >
          Read this week’s guide
        </Link>
        <Link
          href="/shop"
          className="rounded-full border border-ink px-5 py-3 text-sm font-semibold"
        >
          Back to shop
        </Link>
      </div>
    </div>
  );
}
