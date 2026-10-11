import { isGmailConfigured, sendGmail } from "@/lib/gmail";
import { site } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";

const DEFAULT_NOTIFY_TO = "dad@brokedadsclub.com";

async function activeSubscriberCount(): Promise<number | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;
  const { count, error } = await supabase
    .from("subscribers")
    .select("id", { count: "exact", head: true })
    .is("unsubscribed_at", null);
  return error ? null : count;
}

/** Emails the owner about a brand-new subscriber. Never throws: a failed alert must not fail a signup. */
export async function notifyNewSubscriber(email: string, source: string): Promise<void> {
  if (!isGmailConfigured()) return;
  try {
    const count = await activeSubscriberCount();
    const when = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Chicago",
    }).format(new Date());
    await sendGmail({
      to: process.env.SIGNUP_NOTIFY_EMAIL?.trim() || DEFAULT_NOTIFY_TO,
      subject: `New subscriber: ${email}`,
      text: [
        `${email} just signed up on ${site.name}.`,
        "",
        `Where: ${source || "unknown form"}`,
        `When: ${when} Central`,
        ...(count != null ? [`Active subscribers now: ${count}`] : []),
      ].join("\n"),
    });
  } catch (error) {
    console.error("Signup notification failed:", error);
  }
}
