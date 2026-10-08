import { NextResponse, type NextRequest } from "next/server";
import { validateEmail } from "@/lib/email";
import { getLeadMagnet, getLeadMagnetPdf } from "@/lib/lead-magnets";
import { addSubscriber } from "@/lib/subscribers";

/** Stores the email, then streams the PDF back as an attachment for the form to save. */
export async function POST(request: NextRequest, ctx: RouteContext<"/api/lead-magnets/[slug]">) {
  const { slug } = await ctx.params;
  const magnet = getLeadMagnet(slug);
  if (!magnet) {
    return NextResponse.json({ message: "That download doesn't exist." }, { status: 404 });
  }

  let body: { email?: unknown; company?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ message: "Enter your email address." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email : "";
  const invalid = validateEmail(email);
  if (invalid) {
    return NextResponse.json({ message: invalid }, { status: 400 });
  }

  // Honeypot: real people never see the "company" field, so bots get the file without polluting the list.
  const isBot = typeof body.company === "string" && body.company.trim() !== "";
  if (!isBot) {
    const result = await addSubscriber(email, magnet.source);
    if (!result.ok) {
      // Still hand over the PDF. Losing one signup beats punishing the reader for our outage.
      console.error(`Lead magnet ${slug}: could not store subscriber: ${result.message}`);
    }
  }

  const pdf = await getLeadMagnetPdf(magnet);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${magnet.fileName}"`,
      "Content-Length": String(pdf.byteLength),
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
