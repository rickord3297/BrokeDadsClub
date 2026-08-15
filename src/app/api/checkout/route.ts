import { NextResponse } from "next/server";
import { printifySku } from "@/lib/printify";
import { getProductById, productNeedsSize } from "@/lib/products";
import { site } from "@/lib/site";
import { getStripe } from "@/lib/stripe";

type CheckoutItem = { id: string; quantity: number; size?: string };

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        message:
          "Stripe is not configured yet. Add STRIPE_SECRET_KEY in Vercel (or .env.local) and try again.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { items?: CheckoutItem[] };
  const items = body.items ?? [];
  if (!items.length) {
    return NextResponse.json({ message: "Cart is empty." }, { status: 400 });
  }

  const lineItems = [];
  const orderItems: { id: string; quantity: number; size?: string; sku: string }[] =
    [];

  for (const item of items) {
    const product = await getProductById(item.id);
    const quantity = Math.max(1, Math.min(20, Math.floor(item.quantity || 1)));
    if (!product) {
      return NextResponse.json(
        { message: "One of those items is no longer available." },
        { status: 400 },
      );
    }
    const size = item.size?.trim().toUpperCase() || undefined;
    if (productNeedsSize(product) && !size) {
      return NextResponse.json(
        { message: `Pick a size for ${product.name}.` },
        { status: 400 },
      );
    }

    const sku = printifySku(product.slug, productNeedsSize(product) ? size : undefined);
    orderItems.push({ id: product.id, quantity, size, sku });
    lineItems.push({
      quantity,
      price_data: {
        currency: "usd",
        unit_amount: product.price_cents,
        product_data: {
          name: size ? `${product.name} (${size})` : product.name,
          description: product.description,
          metadata: {
            product_id: product.id,
            slug: product.slug,
            size: size ?? "",
            sku,
          },
        },
      },
    });
  }

  const origin = site.url.replace(/\/$/, "");
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    phone_number_collection: { enabled: true },
    shipping_address_collection: { allowed_countries: ["US"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 599, currency: "usd" },
          display_name: "Standard US shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 6 },
            maximum: { unit: "business_day", value: 12 },
          },
        },
      },
    ],
    metadata: {
      items: JSON.stringify(orderItems),
    },
  });

  return NextResponse.json({ url: session.url });
}
