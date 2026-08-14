import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  let status: "missing" | "done" | "error" = "missing";

  if (token && token.length > 8) {
    const supabase = createAdminClient();
    if (!supabase) {
      status = "error";
    } else {
      const { error } = await supabase
        .from("subscribers")
        .update({ unsubscribed_at: new Date().toISOString() })
        .eq("unsubscribe_token", token)
        .is("unsubscribed_at", null);
      status = error ? "error" : "done";
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Recap list</p>
      <h1 className="mt-3 font-display text-4xl">
        {status === "done" ? "You're off the list." : "Unsubscribe"}
      </h1>
      <p className="mt-4 text-base leading-7 text-ink-soft">
        {status === "done"
          ? "No more weekly recaps. The guides stay free either way."
          : status === "error"
            ? "Could not update that subscription. Try the link from your email again."
            : "Use the unsubscribe link in a recap email to get off the list."}
      </p>
      <p className="mt-8 text-sm">
        <Link href="/guides" className="text-pine hover:text-rust">
          ← Back to guides
        </Link>
      </p>
    </div>
  );
}
