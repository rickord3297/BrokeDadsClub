import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { site } from "@/lib/site";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    source?: string;
  };
  const normalized = body.email?.trim().toLowerCase() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return NextResponse.json({ message: "That email doesn't look right." }, { status: 400 });
  }

  const source =
    typeof body.source === "string" ? body.source.trim().slice(0, 120) : "";

  const supabase = createPublicClient();
  if (!supabase) {
    return NextResponse.json({
      message: "You're on the list in spirit. Connect Supabase to store subscribers.",
    });
  }

  // Prefer storing source when the column exists; fall back to email-only.
  let { error } = await supabase
    .from("subscribers")
    .insert(source ? { email: normalized, source } : { email: normalized });
  if (error && source) {
    ({ error } = await supabase.from("subscribers").insert({ email: normalized }));
  }
  if (error && error.code !== "23505") {
    return NextResponse.json(
      { message: "Could not subscribe right now. Try again in a bit." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: site.weekStart.success,
  });
}
