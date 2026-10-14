import nodemailer from "nodemailer";

/**
 * GMAIL_USER is the Google Workspace login; GMAIL_APP_PASSWORD is a 16-character app password, not the account password.
 * GMAIL_FROM must be a "Send mail as" address on that account, or Gmail rewrites it to the login.
 * Gmail files mail sent to the login's own addresses under Sent only, so alerts must go to a different inbox.
 */
function getGmailTransport() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) return null;
  return {
    user,
    transport: nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    }),
  };
}

export function isGmailConfigured(): boolean {
  return getGmailTransport() != null;
}

export async function sendGmail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  unsubscribeUrl?: string;
  attachments?: { filename: string; content: Uint8Array; contentType: string }[];
}): Promise<void> {
  const gmail = getGmailTransport();
  if (!gmail) throw new Error("Gmail is not configured.");
  const from = process.env.GMAIL_FROM?.trim() || gmail.user;
  await gmail.transport.sendMail({
    from: `Broke Dads Club <${from}>`,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
    replyTo: input.replyTo ?? from,
    attachments: input.attachments?.map((file) => ({
      filename: file.filename,
      content: Buffer.from(file.content),
      contentType: file.contentType,
    })),
    headers: input.unsubscribeUrl
      ? { "List-Unsubscribe": `<${input.unsubscribeUrl}>, <mailto:${from}?subject=unsubscribe>` }
      : undefined,
  });
}
