"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatMoney } from "@/lib/format";

export function CartView() {
  const { items, subtotal, setQuantity, removeItem } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function checkout() {
    setStatus("loading");
    setMessage("");
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          size: item.size,
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
        <p className="text-lg">Cart&apos;s empty. The grocery list probably isn&apos;t.</p>
        <Link href="/shop" className="mt-4 inline-block text-sm font-medium text-pine hover:text-rust">
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
            key={`${item.id}:${item.size ?? "one"}`}
            className="flex flex-wrap items-center justify-between gap-4 p-4"
          >
            <div>
              <Link href={`/shop/${item.slug}`} className="font-display text-xl hover:text-rust">
                {item.name}
              </Link>
              <p className="text-sm text-ink-soft">
                {formatMoney(item.price_cents)} each
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
                    setQuantity(item.id, Number(event.target.value), item.size)
                  }
                  className="ml-2 w-16 rounded-md border border-rule bg-paper px-2 py-1"
                />
              </label>
              <button
                type="button"
                onClick={() => removeItem(item.id, item.size)}
                className="text-sm text-ink-soft hover:text-rust"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

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
