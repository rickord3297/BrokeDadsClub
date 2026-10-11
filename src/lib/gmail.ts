import nodemailer from "nodemailer";

/** GMAIL_USER is the Google Workspace login; GMAIL_APP_PASSWORD is a 16-character app password, not the account password. */
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
  replyTo?: string;
}): Promise<void> {
  const gmail = getGmailTransport();
  if (!gmail) throw new Error("Gmail is not configured.");
  await gmail.transport.sendMail({
    from: `Broke Dads Club <${gmail.user}>`,
    to: input.to,
    subject: input.subject,
    text: input.text,
    replyTo: input.replyTo,
  });
}
