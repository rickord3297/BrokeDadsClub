import Link from "next/link";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { withGuideGlossary } from "@/components/guide-glossary-text";
import { ScriptCallout } from "@/components/script-callout";
import { parseScriptListItem } from "@/lib/guide-content";
import { slugifyHeading } from "@/lib/guide-model";
import { site } from "@/lib/site";

const SITE_HOSTS = new Set(
  [new URL(site.url).hostname, "brokedadsclub.com", "www.brokedadsclub.com"],
);

/** Absolute or protocol-relative links to another host. Same-site absolute URLs stay internal. */
export function isExternalHref(href: string): boolean {
  if (!/^(https?:)?\/\//i.test(href)) return false;
  try {
    return !SITE_HOSTS.has(new URL(href, site.url).hostname.toLowerCase());
  } catch {
    return false;
  }
}

const LINK_CLASS =
  "font-medium text-pine underline decoration-rule underline-offset-2 hover:text-rust";

function plainText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plainText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return plainText(
      (node as { props?: { children?: ReactNode } }).props?.children,
    );
  }
  return "";
}

/** Only markdown blockquotes (`>`) become callouts. Body paragraphs stay body. */
function blockquoteKind(text: string): "script" | "truth" {
  const trimmed = text.trim();
  if (/^(truth|remember|note|mindset)\b/i.test(trimmed)) return "truth";
  if (
    /^["“']/.test(trimmed) ||
    /^(try|say|tell them|to your kid|to yourself)\b/i.test(trimmed)
  ) {
    return "script";
  }
  if (trimmed.length < 140 && !trimmed.includes("\n")) return "truth";
  return "script";
}

export function GuideMarkdown({
  content,
  headingCounts,
  currentSlug,
  externalLinkRel = "noopener noreferrer",
}: {
  content: string;
  headingCounts?: Map<string, number>;
  currentSlug?: string;
  /** rel for links that leave the site. External links always open in a new tab. */
  externalLinkRel?: string;
}) {
  const counts = headingCounts ?? new Map<string, number>();

  function gloss(children: ReactNode) {
    return withGuideGlossary(children, currentSlug);
  }

  function headingId(text: string) {
    const base = slugifyHeading(text) || "section";
    const seen = counts.get(base) ?? 0;
    counts.set(base, seen + 1);
    return seen === 0 ? base : `${base}-${seen + 1}`;
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children }) => {
          if (!href) return <span>{children}</span>;
          if (isExternalHref(href)) {
            return (
              <a href={href} target="_blank" rel={externalLinkRel} className={LINK_CLASS}>
                {children}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            );
          }
          return (
            <Link href={href} className={LINK_CLASS}>
              {children}
            </Link>
          );
        },
        h2: ({ children }) => {
          const id = headingId(plainText(children));
          return (
            <h2 id={id} className="scroll-mt-24">
              {children}
            </h2>
          );
        },
        h3: ({ children }) => {
          const id = headingId(plainText(children));
          return (
            <h3 id={id} className="scroll-mt-24">
              {children}
            </h3>
          );
        },
        ul: ({ children }) => (
          <ul className="guide-script-list">{children}</ul>
        ),
        li: ({ children }) => {
          const text = plainText(children).trim();
          const script = parseScriptListItem(text);
          if (script) {
            return (
              <li className="guide-script-list-item">
                <ScriptCallout
                  label={script.label}
                  copyText={script.script}
                  kind="script"
                  className="guide-script-pill"
                >
                  <p>{script.script}</p>
                </ScriptCallout>
              </li>
            );
          }
          return <li>{gloss(children)}</li>;
        },
        blockquote: ({ children }) => {
          const text = plainText(children);
          return (
            <ScriptCallout kind={blockquoteKind(text)} copyText={text}>
              {children}
            </ScriptCallout>
          );
        },
        p: ({ children }) => <p>{gloss(children)}</p>,
        table: () => null,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
