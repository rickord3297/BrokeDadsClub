import { isUndeliverableTestAddress } from "@/lib/email";
import { sendGmail } from "@/lib/gmail";
import { site } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";

const DEFAULT_NOTIFY_TO = "dad@brokedadsclub.com";

export type SignupDigestResult =
  | { ok: true; newSignups: number; activeTotal: number | null; sent: boolean }
  | { ok: false; message: string };

function centralTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Chicago",
  }).format(new Date(iso));
}

/** Emails the owner one summary of signups since `since`. Sends nothing on a day with no signups. */
export async function sendSignupDigest(since: Date): Promise<SignupDigestResult> {
  const supabase = createAdminClient();
  if (!supabase) return { ok: false, message: "Supabase service role is not configured." };

  const { data, error } = await supabase
    .from("subscribers")
    .select("email, source, created_at")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });
  if (error) return { ok: false, message: "Could not load subscribers." };

  const signups = (data ?? []).filter(
    (row): row is { email: string; source: string | null; created_at: string } =>
      typeof row.email === "string" && !isUndeliverableTestAddress(row.email),
  );

  const { data: active, error: activeError } = await supabase
    .from("subscribers")
    .select("email")
    .is("unsubscribed_at", null);
  const activeTotal = activeError
    ? null
    : (active ?? []).filter(
        (row) => typeof row.email === "string" && !isUndeliverableTestAddress(row.email),
      ).length;

  if (signups.length === 0) {
    return { ok: true, newSignups: 0, activeTotal, sent: false };
  }

  const noun = signups.length === 1 ? "signup" : "signups";
  await sendGmail({
    to: process.env.SIGNUP_NOTIFY_EMAIL?.trim() || DEFAULT_NOTIFY_TO,
    subject: `${signups.length} new ${noun} today on ${site.name}`,
    text: [
      `${signups.length} new ${noun} in the last 24 hours:`,
      "",
      ...signups.map(
        (row) => `${row.email}  (${row.source || "unknown form"}, ${centralTime(row.created_at)} Central)`,
      ),
      "",
      ...(activeTotal != null ? [`Active subscribers now: ${activeTotal}`] : []),
    ].join("\n"),
  });
  return { ok: true, newSignups: signups.length, activeTotal, sent: true };
}
