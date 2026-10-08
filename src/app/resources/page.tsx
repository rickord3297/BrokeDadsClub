import type { Metadata } from "next";
import Link from "next/link";
import { ResourceCard } from "@/components/resource-card";
import { resources } from "@/lib/resources";
import { buildPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Free Printable Tools for Dads",
  description:
    "Free fillable and printable checklists for stretched dads: grocery week, bedtime night card, school supply triage, and birthday party budget. Type on your phone or save as PDF.",
  path: "/resources",
  keywords: [
    "free printable budget worksheets",
    "grocery budget checklist printable",
    "kids bedtime routine checklist printable",
    "school supply budget sheet",
    "birthday party budget printable",
  ],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free printable tools from Broke Dads Club",
  isAccessibleForFree: true,
  itemListElement: resources.map((resource, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${site.url}/resources/${resource.slug}`,
    name: resource.title,
  })),
};

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Printables</p>
      <h1 className="mt-3 font-display text-5xl">
        Printable tools you can use this week
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        One-page sheets for the fridge, the backpack, or the party. Fill the
        numbers on your phone, print them, or save as a PDF. No email wall. The
        guides explain the thinking. These are the working copies.
      </p>

      <div className="mt-10 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <ResourceCard key={resource.slug} resource={resource} />
        ))}
      </div>

      <aside className="mt-12 flex flex-col gap-4 rounded-2xl border border-rule border-l-[3px] border-l-rust bg-paper-2/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
            Downloadable PDF
          </p>
          <h2 className="mt-1 font-display text-2xl leading-snug">
            The $47 Weekly Grocery Reset &amp; Trunk Kit Checklist
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-soft">
            The cart, seven dinners, price swaps, and the car kit on one printed page. This one asks
            for your email, then downloads instantly.
          </p>
        </div>
        <Link
          href="/resources/grocery-reset-trunk-kit"
          className="inline-flex h-10 shrink-0 items-center self-start rounded-full bg-pine px-4 text-sm font-semibold text-paper transition hover:bg-pine-2 sm:self-center"
        >
          Get the PDF
        </Link>
      </aside>
    </div>
  );
}
