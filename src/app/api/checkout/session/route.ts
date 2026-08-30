import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function GET(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ message: "Stripe is not configured." }, { status: 503 });
  }

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ message: "Missing session_id." }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ message: "Payment not completed." }, { status: 404 });
    }

    return NextResponse.json({
      value: (session.amount_total ?? 0) / 100,
      currency: session.currency?.toUpperCase() ?? "USD",
    });
  } catch {
    return NextResponse.json({ message: "Session not found." }, { status: 404 });
  }
}
