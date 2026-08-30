import { extractGuideHeadings } from "@/lib/guide-model";

type MarkdownSection = {
  heading: string;
  body: string;
};

const KEEP_GOING = /^keep going$/i;
const THE_POINT = /^the point$/i;

function splitMarkdownSections(content: string): MarkdownSection[] {
  const matches = [...content.matchAll(/^## (.+)$/gm)];
  if (!matches.length) return [];

  return matches.map((match, index) => {
    const heading = match[1].trim();
    const bodyStart = match.index! + match[0].length;
    const bodyEnd =
      index + 1 < matches.length
        ? matches[index + 1].index!
        : content.length;
    return {
      heading,
      body: content.slice(bodyStart, bodyEnd).trim(),
    };
  });
}

/** Split body (post-intro) into main article and synthesis, stripping hub tables. */
export function partitionGuideBody(body: string): {
  main: string;
  thePoint: string;
} {
  const sections = splitMarkdownSections(body);
  if (!sections.length) {
    return { main: body.trim(), thePoint: "" };
  }

  const mainParts: string[] = [];
  let thePoint = "";

  for (const section of sections) {
    if (KEEP_GOING.test(section.heading)) continue;
    if (THE_POINT.test(section.heading)) {
      thePoint = section.body;
      continue;
    }
    mainParts.push(`## ${section.heading}\n\n${section.body}`);
  }

  return {
    main: mainParts.join("\n\n").trim(),
    thePoint,
  };
}

/** TOC: primary H2 sections only (main body, no synthesis or related tables). */
export function extractTocHeadings(mainContent: string) {
  return extractGuideHeadings(mainContent);
}
