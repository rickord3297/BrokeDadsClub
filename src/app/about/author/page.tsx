import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { authorJsonLd, siteAuthor } from "@/lib/author";
import { buildPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: `${siteAuthor.name} | Author at Broke Dads Club`,
  description: siteAuthor.line,
  path: siteAuthor.path,
  keywords: ["broke dads club author", "dad budget writer", siteAuthor.name],
});

export default function AuthorPage() {
  const personLd = {
    "@context": "https://schema.org",
    ...authorJsonLd(),
    description: siteAuthor.line,
    image: `${site.url}${siteAuthor.photoSrc}`,
    worksFor: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <JsonLd data={personLd} />
      <p className="text-xs uppercase tracking-[0.18em] text-rust">Author</p>
      <h1 className="mt-3 font-display text-5xl">{siteAuthor.name}</h1>
      <p className="mt-4 text-lg leading-8 text-ink-soft">{siteAuthor.line}</p>

      <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Image
          src={siteAuthor.photoSrc}
          alt={siteAuthor.photoAlt}
          width={160}
          height={160}
          className="rounded-2xl border border-rule bg-paper-2 object-cover"
        />
        <div className="space-y-3 text-base leading-7 text-ink">
          {siteAuthor.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <p className="mt-10 text-sm text-ink-soft">
        <Link href="/about" className="font-medium text-pine hover:text-rust">
          About the club
        </Link>
        <span className="mx-2 text-rule">·</span>
        <Link href="/guides" className="font-medium text-pine hover:text-rust">
          All guides
        </Link>
      </p>
    </div>
  );
}
