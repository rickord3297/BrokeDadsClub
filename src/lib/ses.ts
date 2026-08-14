import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

export function getSesClient(): SESv2Client | null {
  const region = process.env.AWS_SES_REGION ?? process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!region || !accessKeyId || !secretAccessKey) return null;
  return new SESv2Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export function getSesFromAddress(): string | null {
  const from = process.env.SES_FROM_EMAIL?.trim();
  return from && from.includes("@") ? from : null;
}

export function isSesConfigured(): boolean {
  return getSesClient() != null && getSesFromAddress() != null;
}

export async function sendSesEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
  unsubscribeUrl?: string;
}): Promise<void> {
  const client = getSesClient();
  const from = getSesFromAddress();
  if (!client || !from) {
    throw new Error("Amazon SES is not configured.");
  }

  await client.send(
    new SendEmailCommand({
      FromEmailAddress: from,
      Destination: { ToAddresses: [input.to] },
      Content: {
        Simple: {
          Subject: { Data: input.subject, Charset: "UTF-8" },
          Body: {
            Text: { Data: input.text, Charset: "UTF-8" },
            Html: { Data: input.html, Charset: "UTF-8" },
          },
          Headers: input.unsubscribeUrl
            ? [
                {
                  Name: "List-Unsubscribe",
                  Value: `<${input.unsubscribeUrl}>`,
                },
                {
                  Name: "List-Unsubscribe-Post",
                  Value: "List-Unsubscribe=One-Click",
                },
              ]
            : undefined,
        },
      },
    }),
  );
}
