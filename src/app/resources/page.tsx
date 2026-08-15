import type { Metadata } from "next";
import { ResourceCard } from "@/components/resource-card";
import { resources } from "@/lib/resources";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Printable Tools for Dads",
  description:
    "Free printable checklists and worksheets for stretched dads: grocery week, school supply triage, and birthday party budget. Print or save as PDF.",
  alternates: {
    canonical: `${site.url}/resources`,
  },
};

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
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Free tools</p>
      <h1 className="mt-3 font-display text-5xl">Printable tools you can use this week</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
        One-page sheets for the fridge, the backpack, or the party. No email
        wall. Print them, or save as a PDF from your browser. The guides explain
        the thinking. These are the working copies.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {resources.map((resource) => (
          <ResourceCard key={resource.slug} resource={resource} />
        ))}
      </div>
    </div>
  );
}
