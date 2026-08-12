import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

export async function POST(request: Request) {
  const { email } = (await request.json()) as { email?: string };
  const normalized = email?.trim().toLowerCase() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return NextResponse.json({ message: "That email doesn't look right." }, { status: 400 });
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return NextResponse.json({
      message: "You're on the list in spirit. Connect Supabase to store subscribers.",
    });
  }

  const { error } = await supabase.from("subscribers").insert({ email: normalized });
  if (error && error.code !== "23505") {
    return NextResponse.json(
      { message: "Could not subscribe right now. Try again in a bit." },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "You're in. Sunday dispatch incoming." });
}
