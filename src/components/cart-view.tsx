"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { cartLineKey, useCart } from "@/components/cart-provider";
import { trackCheckoutStart } from "@/lib/analytics";
import { formatMoney } from "@/lib/format";
import { CASTLE_PIN_SLUG } from "@/lib/product-display";
import type { Product } from "@/lib/products";

export function CartView({
  upsellProduct = null,
}: {
  upsellProduct?: Product | null;
}) {
  const { items, subtotal, setQuantity, removeItem } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const hasPin = items.some((item) => item.slug === CASTLE_PIN_SLUG);
  const showUpsell = Boolean(upsellProduct && ready && items.length > 0 && !hasPin);

  async function checkout() {
    setStatus("loading");
    setMessage("");
    trackCheckoutStart(
      items.reduce((count, item) => count + item.quantity, 0),
      subtotal,
    );
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          sku: item.sku,
        })),
      }),
    });
    const payload = (await response.json()) as { url?: string; message?: string };
    if (!response.ok || !payload.url) {
      setStatus("error");
      setMessage(payload.message ?? "Checkout is not ready yet.");
      return;
    }
    window.location.href = payload.url;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-rule bg-paper-2 p-8">
        <p className="text-lg">
          Cart&apos;s empty. The grocery list probably isn&apos;t.
        </p>
        <Link
          href="/shop"
          className="mt-4 inline-block text-sm font-medium text-pine hover:text-rust"
        >
          Browse the shop →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="divide-y divide-rule rounded-2xl border border-rule bg-paper">
        {items.map((item) => (
          <li
            key={cartLineKey(item)}
            className="flex flex-wrap items-center justify-between gap-4 p-4"
          >
            <div>
              <Link
                href={`/shop/${item.slug}`}
                className="font-display text-xl hover:text-rust"
              >
                {item.name}
              </Link>
              <p className="text-sm text-ink-soft">
                {formatMoney(item.price_cents)} each
                {item.color ? ` · ${item.color}` : ""}
                {item.size ? ` · Size ${item.size}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-ink-soft">
                Qty
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) =>
                    setQuantity(cartLineKey(item), Number(event.target.value))
                  }
                  className="ml-2 w-16 rounded-md border border-rule bg-paper px-2 py-1"
                />
              </label>
              <button
                type="button"
                onClick={() => removeItem(cartLineKey(item))}
                className="text-sm text-ink-soft hover:text-rust"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showUpsell && upsellProduct ? (
        <CartPinUpsell product={upsellProduct} />
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-display text-2xl">Subtotal {formatMoney(subtotal)}</p>
        <button
          type="button"
          onClick={checkout}
          disabled={status === "loading"}
          className="rounded-full bg-rust px-5 py-3 text-sm font-semibold text-paper hover:bg-rust-2 disabled:opacity-60"
        >
          {status === "loading" ? "Redirecting…" : "Checkout with Stripe"}
        </button>
      </div>
      {message ? <p className="text-sm text-rust">{message}</p> : null}
    </div>
  );
}

function CartPinUpsell({ product }: { product: Product }) {
  const image = product.images?.[0]?.src ?? product.image;

  return (
    <div className="rounded-2xl border border-gold/30 bg-gold/[0.08] p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {image ? (
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-rule bg-paper">
            <Image
              src={image}
              alt=""
              width={128}
              height={128}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pine">
            Add for {formatMoney(product.price_cents)}
          </p>
          <p className="mt-1 font-display text-xl">{product.name}</p>
          <p className="mt-1 text-sm text-ink-soft">
            Easy club crest for the jacket pocket.
          </p>
        </div>
        <div className="shrink-0">
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </div>
  );
}
