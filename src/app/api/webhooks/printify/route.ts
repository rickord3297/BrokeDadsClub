import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { markPrintifyPublishSucceeded } from "@/lib/printify";

type PrintifyWebhook = {
  type?: string;
  resource?: { id?: string };
};

function validPrintifySignature(payload: string, signature: string | null) {
  const secret = process.env.PRINTIFY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = `sha256=${createHmac("sha256", secret).update(payload).digest("hex")}`;
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!process.env.PRINTIFY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Webhook not configured." }, { status: 503 });
  }

  const payload = await request.text();
  const signature = request.headers.get("x-pfy-signature");
  if (!validPrintifySignature(payload, signature)) {
    return NextResponse.json({ message: "Invalid signature." }, { status: 400 });
  }

  let event: PrintifyWebhook;
  try {
    event = JSON.parse(payload) as PrintifyWebhook;
  } catch {
    return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
  }

  if (event.type === "product:publish:started" && event.resource?.id) {
    await markPrintifyPublishSucceeded(event.resource.id);
    revalidateTag("printify-products", "max");
  }

  return NextResponse.json({ ok: true });
}
