import { NextResponse } from "next/server";
import { buildLocalHealth } from "@/lib/uptime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = {
  "Cache-Control": "no-store, max-age=0",
};

export async function GET() {
  const health = await buildLocalHealth();
  return NextResponse.json(health, {
    status: health.ok ? 200 : 503,
    headers: NO_STORE,
  });
}

export async function HEAD() {
  const health = await buildLocalHealth();
  return new NextResponse(null, {
    status: health.ok ? 200 : 503,
    headers: NO_STORE,
  });
}
