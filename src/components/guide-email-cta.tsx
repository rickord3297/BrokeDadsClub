import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";

export function GuideEmailCta({
 source,
 leadHref,
}: {
 source: string;
 leadHref?: string;
}) {
 return (
 <aside className="my-10 rounded-2xl border border-rule bg-paper-2 px-5 py-6 sm:px-6">
 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
 Sunday dispatch
 </p>
 <p className="mt-2 font-display text-2xl leading-snug">
 Get free weekly tactics, not hustle spam.
 </p>
 <p className="mt-2 text-sm leading-6 text-ink-soft">
 One email a week. Money, kids, time. Unsubscribe whenever.
 {leadHref ? (
 <>
 {" "}
 Prefer a printable?{" "}
 <Link href={leadHref} className="font-medium text-pine hover:text-rust">
 Grab the free checklist →
 </Link>
 </>
 ) : null}
 </p>
 <div className="mt-4">
 <NewsletterForm
 variant="article"
 source={source}
 submitLabel="Get Free Weekly Tactics"
 />
 </div>
 </aside>
 );
}
