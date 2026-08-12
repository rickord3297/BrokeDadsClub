import { NextResponse } from "next/server";
import { getProductById } from "@/lib/products";
import { site } from "@/lib/site";
import { getStripe } from "@/lib/stripe";

type CheckoutItem = { id: string; quantity: number };

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
  for (const item of items) {
    const product = await getProductById(item.id);
    const quantity = Math.max(1, Math.min(20, Math.floor(item.quantity || 1)));
    if (!product) {
      return NextResponse.json(
        { message: "One of those items is no longer available." },
        { status: 400 },
      );
    }
    lineItems.push({
      quantity,
      price_data: {
        currency: "usd",
        unit_amount: product.price_cents,
        product_data: {
          name: product.name,
          description: product.description,
          metadata: { product_id: product.id, slug: product.slug },
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
  });

  return NextResponse.json({ url: session.url });
}
