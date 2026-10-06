import Link from "next/link";
import { WeekStartSignup } from "@/components/week-start-signup";
import { site } from "@/lib/site";

/** Homepage bottom band: email signup + social profiles (common blog pattern). */
export function HomeFollowSection() {
  if (!site.social.length) return null;

  return (
    <section className="scroll-mt-20 border-t border-rule bg-paper-2/50">
      <div className="mx-auto max-w-6xl px-4 section-pad-sm sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <WeekStartSignup source="homepage_footer" compact />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
              Follow
            </p>
            <h2 className="mt-2 font-display text-3xl leading-tight">
              Clips, shop drops, and the in-between
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              Short clips, shop drops, and the stuff that does not fit in a guide.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {site.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md border border-rule bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-pine hover:text-pine"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <p className="mt-4 text-sm text-ink-soft">
              Prefer the site shop?{" "}
              <Link href="/shop" className="font-medium text-pine hover:text-rust">
                Browse club wear →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
