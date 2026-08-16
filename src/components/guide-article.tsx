import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GuideEmailCta } from "@/components/guide-email-cta";
import { GuideShop } from "@/components/guide-shop";
import { RelatedGuides } from "@/components/related-guides";
import { WaitingCostModeler } from "@/components/waiting-cost-modeler";
import { formatDate } from "@/lib/format";
import {
  guideKeywords,
  splitGuideContent,
  type Guide,
} from "@/lib/guides";
import { site } from "@/lib/site";

function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children }) => {
          if (!href) return <span>{children}</span>;
          const external = href.startsWith("http");
          return (
            <Link
              href={href}
              className="font-medium text-pine underline decoration-rule underline-offset-2 hover:text-rust"
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {children}
            </Link>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export function GuideArticle({
  guide,
  related,
  preview = false,
}: {
  guide: Guide;
  related: Guide[];
  preview?: boolean;
}) {
  const url = `${site.url}/guides/${guide.slug}`;
  const keywords = guideKeywords(guide);
  const [beforeCta, afterCta] = splitGuideContent(guide.content);
  const showWaitingCostModeler = guide.slug === "retirement-can-wait";

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.publishedAt,
    author: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/brand/club-logo.png`,
      },
    },
    mainEntityOfPage: url,
    keywords: keywords.join(", "),
    articleSection: guide.category,
  };

  const faqLd =
    guide.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: guide.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        {preview ? (
          <p className="mb-6 rounded-xl border border-rule bg-paper-2 px-4 py-3 text-sm text-ink-soft">
            Internal draft preview ({guide.status}). Not indexed. Public URL
            stays hidden until this guide is scheduled or published.
          </p>
        ) : null}
        {!preview ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
          />
        ) : null}
        {!preview && faqLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
          />
        ) : null}

        <p className="text-xs uppercase tracking-[0.18em] text-rust">
          {guide.category} · {guide.readTime}
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
          {guide.title}
        </h1>
        <p className="mt-4 text-sm text-ink-soft">
          {formatDate(guide.publishedAt)}
        </p>

        <div className="prose-guide mt-10">
          <Markdown content={beforeCta} />
        </div>

        {showWaitingCostModeler ? <WaitingCostModeler /> : null}

        <GuideEmailCta source={`guide:${guide.slug}`} />

        {afterCta ? (
          <div className="prose-guide">
            <Markdown content={afterCta} />
          </div>
        ) : null}

        {guide.faq.length > 0 ? (
          <section className="mt-12 border-t border-rule pt-8">
            <h2 className="font-display text-3xl">Quick answers</h2>
            <dl className="mt-6 space-y-5">
              {guide.faq.map((item) => (
                <div key={item.question}>
                  <dt className="font-display text-xl">{item.question}</dt>
                  <dd className="mt-2 text-base leading-7 text-ink-soft">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
      </article>
      <div className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <GuideShop slugs={guide.shop} />
        <RelatedGuides guides={related} />
        <p className="mt-12 border-t border-rule pt-6 text-sm">
          <Link href="/guides" className="text-pine hover:text-rust">
            ← All guides
          </Link>
        </p>
      </div>
    </>
  );
}
