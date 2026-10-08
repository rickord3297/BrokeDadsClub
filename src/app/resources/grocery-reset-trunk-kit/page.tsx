import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { LeadMagnetForm } from "@/components/lead-magnet-form";
import { getLeadMagnet } from "@/lib/lead-magnets";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";
import preview from "../../../../public/lead-magnets/grocery-reset-trunk-kit-preview.jpg";

const SLUG = "grocery-reset-trunk-kit";

export const metadata: Metadata = buildPageMetadata({
  title: "Free $47 Grocery Reset & Trunk Kit Checklist (Printable PDF) | Broke Dads Club",
  absoluteTitle: true,
  description:
    "A free one-page printable: the $47 family grocery cart with price targets, a 7-night dinner plan, price spike swaps, and a car emergency dinner kit checklist.",
  path: `/resources/${SLUG}`,
  keywords: [
    "printable grocery budget checklist",
    "$50 a week grocery list printable",
    "emergency food kit for car checklist",
    "trunk dinner kit for kids",
  ],
});

const INSIDE = [
  {
    title: "The $47 cart",
    body: "About 20 items in four groups, each with a price target and a Paid line. Check it off in the aisle.",
  },
  {
    title: "Seven dinners",
    body: "Monday cooks extra so Tuesday and Thursday are leftovers. Wednesday is the tired night on purpose.",
  },
  {
    title: "Price spike swaps",
    body: "What to grab when chicken, eggs, or bread jump, plus the put-back order when the register says $61.",
  },
  {
    title: "The trunk kit",
    body: "A $12 bin of shelf-stable dinner so gas station panic is a backup, with a restock log for grocery day.",
  },
];

export default function GroceryResetTrunkKitPage() {
  const magnet = getLeadMagnet(SLUG);
  if (!magnet) notFound();

  const url = absoluteUrl(`/resources/${SLUG}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: magnet.title,
    url,
    encodingFormat: "application/pdf",
    isAccessibleForFree: true,
    image: absoluteUrl(preview.src),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <JsonLd data={jsonLd} />
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
        <Link href="/resources" className="font-medium text-pine hover:text-rust">
          <span aria-hidden>← </span>All printables
        </Link>
      </nav>

      <div className="mt-6 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div>
          <span className="rounded-full bg-rust/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-rust-2">
            Free printable · 1 page PDF
          </span>
          <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">{magnet.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
            One shop, one cart, one bin in the trunk. Print it on a single sheet, stick it on the
            fridge, and restock the car on the same grocery trip.
          </p>

          <section
            aria-labelledby="signup-heading"
            className="mt-8 rounded-2xl border border-rule border-l-[3px] border-l-rust bg-paper-2/70 p-5 sm:p-7"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">Instant download</p>
            <h2 id="signup-heading" className="mt-1 font-display text-2xl leading-snug">
              Get the checklist
            </h2>
            <p className="mt-1 mb-4 text-sm leading-6 text-ink-soft">
              Enter your email and the PDF downloads right away.
            </p>
            <LeadMagnetForm slug={magnet.slug} fileName={magnet.fileName} source={magnet.source} />
          </section>

          <section aria-labelledby="inside-heading" className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">What&apos;s on the page</p>
            <h2 id="inside-heading" className="mt-1 font-display text-2xl leading-snug sm:text-3xl">
              Four tools, one sheet of paper
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {INSIDE.map((item) => (
                <li key={item.title} className="rounded-xl border border-rule bg-paper p-4">
                  <h3 className="font-display text-lg leading-snug text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">{item.body}</p>
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-8 text-sm leading-6 text-ink-soft">
            The thinking behind it:{" "}
            <Link href="/guides/the-47-dollar-grocery-week" className="font-medium text-pine hover:text-rust">
              the $47 grocery week
            </Link>{" "}
            and{" "}
            <Link href="/guides/trunk-dinner-kit-beat-gas-station-panic" className="font-medium text-pine hover:text-rust">
              the trunk dinner kit
            </Link>
            .
          </p>
        </div>

        <figure className="lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-lg border border-rule bg-white shadow-lg shadow-ink/10 ring-1 ring-ink/5">
            <Image
              src={preview}
              alt="Preview of the one-page PDF: a $47 grocery cart checklist with price targets, a trunk kit checklist, a seven-night dinner plan, and price spike swaps."
              sizes="(min-width: 1024px) 26rem, 100vw"
              placeholder="blur"
              priority
            />
          </div>
          <figcaption className="mt-3 text-center text-xs text-ink-soft">
            Prints on one 8.5 x 11 page.
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
