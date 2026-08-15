import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createPrintifyOrder, isPrintifyConfigured } from "@/lib/printify";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

type OrderItem = { id: string; quantity: number; size?: string; sku: string };

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ message: "Webhook not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ message: "Missing signature." }, { status: 400 });
  }

  const payload = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ message: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const printify = await submitPrintifyOrder(session);

    const supabase = createAdminClient();
    if (supabase) {
      await supabase.from("orders").upsert({
        stripe_session_id: session.id,
        email: session.customer_details?.email ?? session.customer_email,
        amount_total: session.amount_total ?? 0,
        currency: session.currency ?? "usd",
        status: session.payment_status ?? "paid",
        printify_order_id: printify?.id ?? null,
        printify_status: printify?.status ?? (isPrintifyConfigured() ? "error" : null),
      });
    }

    if (isPrintifyConfigured() && !printify) {
      return NextResponse.json(
        { message: "Paid, but Printify order failed." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}

function shippingFromSession(session: Stripe.Checkout.Session) {
  return session.collected_information?.shipping_details ?? null;
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const first_name = parts[0] || "Customer";
  const last_name = parts.slice(1).join(" ") || "Customer";
  return { first_name, last_name };
}

async function submitPrintifyOrder(session: Stripe.Checkout.Session) {
  if (!isPrintifyConfigured()) return null;

  let items: OrderItem[] = [];
  try {
    items = JSON.parse(session.metadata?.items ?? "[]") as OrderItem[];
  } catch {
    items = [];
  }
  if (!items.length) {
    console.error("Printify: checkout session had no item metadata", session.id);
    return null;
  }

  const shipping = shippingFromSession(session);
  if (!shipping) {
    console.error("Printify: missing shipping address", session.id);
    return null;
  }
  const address = shipping.address;
  if (!address.line1 || !address.city || !address.postal_code || !address.country) {
    console.error("Printify: missing shipping address", session.id);
    return null;
  }

  const email = session.customer_details?.email ?? session.customer_email;
  if (!email) {
    console.error("Printify: missing email", session.id);
    return null;
  }

  const { first_name, last_name } = splitName(
    shipping.name ?? session.customer_details?.name ?? "",
  );

  try {
    return await createPrintifyOrder({
      externalId: session.id,
      label: session.id.slice(-8),
      lineItems: items.map((item) => ({
        sku: item.sku,
        quantity: item.quantity,
      })),
      address: {
        first_name,
        last_name,
        email,
        phone: session.customer_details?.phone ?? "",
        country: address.country,
        region: address.state ?? "",
        address1: address.line1,
        address2: address.line2 ?? "",
        city: address.city,
        zip: address.postal_code,
      },
    });
  } catch (error) {
    console.error("Printify: order submit failed", session.id, error);
    return null;
  }
}
