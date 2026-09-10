import Link from "next/link";
import { START_HERE_SLUGS, getGuide } from "@/lib/guides";

const HOME_START_HERE = [
  ...START_HERE_SLUGS,
  "the-after-school-collapse-is-not-a-bad-kid",
] as const;

export function StartHereGuideLinks({
  heading = "Start here",
  source = "home",
}: {
  heading?: string;
  source?: "home" | "about";
}) {
  const picks = HOME_START_HERE.map((slug) => getGuide(slug)).filter(
    (guide): guide is NonNullable<typeof guide> => Boolean(guide),
  );

  if (!picks.length) return null;

  return (
    <aside
      className={
        source === "about"
          ? "mt-10 rounded-2xl border border-rule bg-paper-2/50 px-5 py-6"
          : "mt-8 rounded-2xl border border-rule bg-paper-2/50 px-5 py-5"
      }
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
        {heading}
      </p>
      <ul className="mt-3 space-y-2">
        {picks.slice(0, 5).map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/guides/${guide.slug}`}
              className="font-medium text-pine hover:text-rust"
            >
              {guide.title}
            </Link>
            <span className="text-sm text-ink-soft"> · {guide.category}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">
        <Link href="/guides" className="font-medium text-ink hover:text-pine">
          All guides →
        </Link>
      </p>
    </aside>
  );
}
