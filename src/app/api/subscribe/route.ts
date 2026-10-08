import { NextResponse } from "next/server";
import { validateEmail } from "@/lib/email";
import { site } from "@/lib/site";
import { addSubscriber } from "@/lib/subscribers";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    source?: string;
  };
  const email = body.email ?? "";
  const invalid = validateEmail(email);
  if (invalid) {
    return NextResponse.json({ message: invalid }, { status: 400 });
  }

  const result = await addSubscriber(email, typeof body.source === "string" ? body.source : "");
  if (!result.ok) {
    return NextResponse.json(
      { message: "Could not subscribe right now. Try again in a bit." },
      { status: 500 },
    );
  }
  if (!result.stored) {
    return NextResponse.json({
      message: "You're on the list in spirit. Connect Supabase to store subscribers.",
    });
  }

  return NextResponse.json({
    message: site.weekStart.success,
  });
}
