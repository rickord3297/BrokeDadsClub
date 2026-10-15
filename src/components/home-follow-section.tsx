import Link from "next/link";
import { site } from "@/lib/site";

/** Homepage bottom band: social profiles. The signup sits just above in HomeFinalSignup. */
export function HomeFollowSection() {
  if (!site.social.length) return null;

  return (
    <section className="scroll-mt-20 border-t border-rule bg-paper-2/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
            Follow
          </p>
          <h2 className="mt-2 font-display text-2xl leading-tight sm:text-3xl">
            Clips, shop drops, and the in-between
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Prefer the site shop?{" "}
            <Link href="/shop" className="font-medium text-pine hover:text-rust">
              Browse club wear →
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
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
      </div>
    </section>
  );
}
