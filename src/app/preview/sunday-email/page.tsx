import type { Metadata } from "next";
import { getGuides } from "@/lib/guides";
import { buildRecapEmail } from "@/lib/recap";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sunday email preview",
  robots: { index: false, follow: false },
};

function PreviewFrame({
  label,
  subject,
  html,
}: {
  label: string;
  subject: string;
  html: string;
}) {
  return (
    <section className="mt-12">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">{label}</p>
      <p className="mt-2 text-sm text-ink-soft">
        <span className="font-medium text-ink">Subject:</span> {subject}
      </p>
      <iframe
        title={label}
        srcDoc={html}
        className="mt-4 h-[920px] w-full rounded-2xl border border-rule bg-paper"
      />
    </section>
  );
}

export default function SundayEmailPreviewPage() {
  const guides = getGuides();
  const sample = guides.slice(0, 2);
  const fallback =
    guides.find((guide) => guide.slug === "the-47-dollar-grocery-week") ??
    guides[0];
  const unsubscribeUrl = `${site.url}/unsubscribe?token=preview`;
  const withNews = buildRecapEmail(sample, unsubscribeUrl, { quietWeek: false });
  const quiet = buildRecapEmail(fallback ? [fallback] : sample, unsubscribeUrl, {
    quietWeek: true,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Internal preview</p>
      <h1 className="mt-3 font-display text-4xl">Sunday email</h1>
      <p className="mt-4 text-base leading-7 text-ink-soft">
        This page is not in the nav and should not be indexed. Two versions: a
        week with new guides, and a quiet week that still sends one useful
        thing.
      </p>
      {sample.length > 0 ? (
        <PreviewFrame
          label="Week with new guides"
          subject={withNews.subject}
          html={withNews.html}
        />
      ) : null}
      <PreviewFrame label="Quiet week" subject={quiet.subject} html={quiet.html} />
    </div>
  );
}
