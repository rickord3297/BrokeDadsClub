import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDate } from "@/lib/format";
import { getGuide, getGuides } from "@/lib/guides";

export async function generateStaticParams() {
  return getGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide" };
  return { title: guide.title, description: guide.excerpt };
}

export default async function GuidePage({
  params,
}: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-rust">
        {guide.category} · {guide.readTime}
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
        {guide.title}
      </h1>
      <p className="mt-4 text-sm text-ink-soft">{formatDate(guide.publishedAt)}</p>
      <div className="prose-guide mt-10">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{guide.content}</ReactMarkdown>
      </div>
      <p className="mt-12 border-t border-rule pt-6 text-sm">
        <Link href="/guides" className="text-pine hover:text-rust">
          ← All guides
        </Link>
      </p>
    </article>
  );
}
