import { after } from "next/server";
import { normalizeEmail } from "@/lib/email";
import { notifyNewSubscriber } from "@/lib/signup-notify";
import { createPublicClient } from "@/lib/supabase/public";

export type AddSubscriberResult =
  | { ok: true; stored: boolean }
  | { ok: false; message: string };

/** Inserts into `subscribers`. Duplicates count as success. `stored` is false when Supabase isn't configured. */
export async function addSubscriber(email: string, source = ""): Promise<AddSubscriberResult> {
  const normalized = normalizeEmail(email);
  const cleanSource = source.trim().slice(0, 120);

  const supabase = createPublicClient();
  if (!supabase) return { ok: true, stored: false };

  // Prefer storing source when the column exists; fall back to email-only.
  let { error } = await supabase
    .from("subscribers")
    .insert(cleanSource ? { email: normalized, source: cleanSource } : { email: normalized });
  if (error && cleanSource) {
    ({ error } = await supabase.from("subscribers").insert({ email: normalized }));
  }
  if (error && error.code !== "23505") {
    return { ok: false, message: error.message };
  }
  if (!error) {
    after(() => notifyNewSubscriber(normalized, cleanSource));
  }
  return { ok: true, stored: true };
}
