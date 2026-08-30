import {
  cloneElement,
  Fragment,
  isValidElement,
  type ReactNode,
} from "react";
import { GuideGlossaryPill } from "@/components/guide-glossary-pill";
import { sortedGlossaryTerms } from "@/lib/guide-glossary";

const SKIP_TYPES = new Set(["a", "code", "pre"]);

function injectGlossary(text: string, currentSlug?: string): ReactNode[] {
  const terms = sortedGlossaryTerms(currentSlug);
  if (!terms.length || !text) return [text];

  type Match = { index: number; length: number; slug: string; label: string; hint: string };
  const matches: Match[] = [];

  for (const term of terms) {
    const pattern = new RegExp(term.pattern.source, term.pattern.flags);
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const overlaps = matches.some(
        (existing) =>
          match!.index < existing.index + existing.length &&
          match!.index + match![0].length > existing.index,
      );
      if (!overlaps) {
        matches.push({
          index: match.index,
          length: match[0].length,
          slug: term.slug,
          label: match[0],
          hint: term.hint,
        });
      }
    }
  }

  if (!matches.length) return [text];

  matches.sort((a, b) => a.index - b.index);
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.index > cursor) {
      nodes.push(text.slice(cursor, match.index));
    }
    nodes.push(
      <GuideGlossaryPill
        key={`${match.slug}-${match.index}`}
        slug={match.slug}
        label={match.label}
        hint={match.hint}
      />,
    );
    cursor = match.index + match.length;
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return nodes;
}

export function withGuideGlossary(
  nodes: ReactNode,
  currentSlug?: string,
): ReactNode {
  if (typeof nodes === "string") {
    return injectGlossary(nodes, currentSlug);
  }

  if (typeof nodes === "number") {
    return nodes;
  }

  if (Array.isArray(nodes)) {
    return nodes.map((child, index) => (
      <Fragment key={index}>{withGuideGlossary(child, currentSlug)}</Fragment>
    ));
  }

  if (isValidElement(nodes)) {
    const type = nodes.type;
    if (typeof type === "string" && SKIP_TYPES.has(type)) {
      return nodes;
    }
    if (type === GuideGlossaryPill) {
      return nodes;
    }

    const childProps = nodes.props as { children?: ReactNode };
    if (!childProps.children) return nodes;

    return cloneElement(
      nodes,
      undefined,
      withGuideGlossary(childProps.children, currentSlug),
    );
  }

  return nodes;
}
