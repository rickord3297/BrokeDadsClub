import { NextResponse } from "next/server";
import { isSesConfigured, sendSesEmail } from "@/lib/ses";
import { site } from "@/lib/site";

function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    message?: string;
    website?: string;
  };

  // Honeypot for bots
  if (body.website?.trim()) {
    return NextResponse.json({ message: "Message sent. We'll get back to you." });
  }

  const name = cleanText(body.name, 80);
  const email = cleanText(body.email, 120).toLowerCase();
  const message = cleanText(body.message, 2000);

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { message: "Enter a valid email so we can reply." },
      { status: 400 },
    );
  }

  if (message.length < 10) {
    return NextResponse.json(
      { message: "Add a few more words so we know how to help." },
      { status: 400 },
    );
  }

  if (!isSesConfigured()) {
    return NextResponse.json(
      { message: "Contact form is not available right now. Try again later." },
      { status: 503 },
    );
  }

  const fromLabel = name || "A dad";
  const subject = `${site.name} contact from ${fromLabel}`;
  const text = [
    `From: ${fromLabel}`,
    `Email: ${email}`,
    "",
    message,
  ].join("\n");
  const html = `
    <p><strong>From:</strong> ${escapeHtml(fromLabel)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
    <hr />
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `.trim();

  try {
    await sendSesEmail({
      to: site.email,
      replyTo: email,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Contact form send failed:", error);
    return NextResponse.json(
      { message: "Could not send that message. Try again in a bit." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Message sent. We'll read it and get back to you.",
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
