import { extractGuideHeadings, slugifyHeading } from "@/lib/guide-model";

export type FieldProtocolStep = {
  label: string;
  detail: string;
};

export type FieldProtocol = {
  headline: string;
  steps: FieldProtocolStep[];
};

type MarkdownSection = {
  heading: string;
  body: string;
};

const KEEP_GOING = /^keep going$/i;
const THE_POINT = /^the point$/i;
const FIELD_PROTOCOL = /^do this\b/i;

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

function parseNumberedSteps(body: string): FieldProtocolStep[] {
  const steps: FieldProtocolStep[] = [];

  for (const line of body.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const labeled = trimmed.match(/^\d+\.\s+\*\*(.+?)\*\*:?\s*(.*)$/);
    if (labeled) {
      steps.push({
        label: labeled[1].trim(),
        detail: labeled[2].trim() || labeled[1].trim(),
      });
      continue;
    }

    const plain = trimmed.match(/^\d+\.\s+(.+)$/);
    if (plain) {
      steps.push({ label: "", detail: plain[1].trim() });
    }
  }

  return steps;
}

/** Split body (post-intro) into field protocol, main article, and synthesis. */
export function partitionGuideBody(body: string): {
  fieldProtocol: FieldProtocol | null;
  main: string;
  thePoint: string;
} {
  const sections = splitMarkdownSections(body);
  if (!sections.length) {
    return { fieldProtocol: null, main: body.trim(), thePoint: "" };
  }

  let fieldProtocol: FieldProtocol | null = null;
  const mainParts: string[] = [];
  let thePoint = "";

  for (const section of sections) {
    if (FIELD_PROTOCOL.test(section.heading)) {
      const steps = parseNumberedSteps(section.body);
      if (steps.length > 0) {
        fieldProtocol = { headline: section.heading, steps };
      }
      continue;
    }
    if (KEEP_GOING.test(section.heading)) continue;
    if (THE_POINT.test(section.heading)) {
      thePoint = section.body;
      continue;
    }
    mainParts.push(`## ${section.heading}\n\n${section.body}`);
  }

  return {
    fieldProtocol,
    main: mainParts.join("\n\n").trim(),
    thePoint,
  };
}

/** TOC: primary H2 sections only (main body, no synthesis or related tables). */
export function extractTocHeadings(mainContent: string) {
  return extractGuideHeadings(mainContent);
}

const SCRIPT_LABEL =
  /^(to (?:your|another|the)\s+[^:]+|try|say|tell them|to yourself)\s*:\s*(.+)$/i;

export function parseScriptListItem(text: string): {
  label: string;
  script: string;
} | null {
  const trimmed = text.trim();
  const match = trimmed.match(SCRIPT_LABEL);
  if (!match) return null;

  const script = match[2]
    .trim()
    .replace(/^["“]|["”]$/g, "")
    .trim();
  if (!script) return null;

  return {
    label: match[1].trim(),
    script,
  };
}

export function headingAnchor(text: string, used: Set<string>): string {
  let id = slugifyHeading(text) || "section";
  if (used.has(id)) {
    let n = 2;
    while (used.has(`${id}-${n}`)) n += 1;
    id = `${id}-${n}`;
  }
  used.add(id);
  return id;
}
