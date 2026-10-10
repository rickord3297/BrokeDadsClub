import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  sheetHasSample,
  sheetPreviewItems,
  type BoxColumn,
  type ChecklistItem,
  type FieldItem,
  type Printable,
  type PrintableStatus,
  type ScriptLine,
  type SheetBlock,
  type SheetSection,
} from "@/lib/printable-model";
import { resources, type Resource, type ResourceTag } from "@/lib/resources";

export type { Printable, SheetBlock, SheetSection } from "@/lib/printable-model";

const printablesDir = path.join(process.cwd(), "content/printables");

const RESOURCE_TAGS: readonly ResourceTag[] = [
  "5-Min Prep",
  "Single-Page",
  "Seasonal",
  "Ink-Friendly",
  "Fillable",
];

class PrintableError extends Error {
  constructor(file: string, message: string) {
    super(`content/printables/${file}: ${message}`);
    this.name = "PrintableError";
  }
}

type Row = Record<string, unknown>;

const isObject = (value: unknown): value is Row =>
  value != null && typeof value === "object" && !Array.isArray(value);

function str(value: unknown): string {
  if (typeof value === "number") return String(value);
  return typeof value === "string" ? value.trim() : "";
}

function requireStr(row: Row, key: string, file: string, where: string): string {
  const value = str(row[key]);
  if (!value) throw new PrintableError(file, `${where} needs "${key}".`);
  return value;
}

function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(str).filter(Boolean) : [];
}

/** gray-matter turns unquoted YAML dates into Date objects. */
function parseDate(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  const text = str(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null;
}

function parseStatus(value: unknown, file: string): PrintableStatus {
  if (value === "draft" || value === "scheduled" || value === "published") return value;
  throw new PrintableError(file, `status must be draft, scheduled, or published.`);
}

function parseChecklist(value: unknown, file: string, where: string): ChecklistItem[] {
  if (!Array.isArray(value) || value.length === 0) throw new PrintableError(file, `${where} checklist is empty.`);
  return value.map((item) => {
    if (typeof item === "string") return { label: item.trim() };
    if (isObject(item)) return { label: requireStr(item, "label", file, where), sample: item.sample === true };
    throw new PrintableError(file, `${where} checklist items must be text or { label, sample }.`);
  });
}

function parseFields(value: unknown, file: string, where: string): FieldItem[] {
  if (!Array.isArray(value) || value.length === 0) throw new PrintableError(file, `${where} fields is empty.`);
  return value.map((item) => {
    if (typeof item === "string") return { label: item.trim() };
    if (isObject(item)) {
      return {
        label: requireStr(item, "label", file, where),
        placeholder: str(item.placeholder) || undefined,
        sample: str(item.sample) || undefined,
      };
    }
    throw new PrintableError(file, `${where} fields must be text or { label, placeholder, sample }.`);
  });
}

function parseBoxes(value: unknown, file: string, where: string): BoxColumn[] {
  if (!Array.isArray(value) || value.length === 0) throw new PrintableError(file, `${where} boxes is empty.`);
  return value.map((item) => {
    if (!isObject(item)) throw new PrintableError(file, `${where} boxes must be { title, hint, rows }.`);
    const rows = Number(item.rows ?? 6);
    return {
      title: requireStr(item, "title", file, where),
      hint: str(item.hint) || undefined,
      rows: Number.isInteger(rows) && rows > 0 && rows <= 20 ? rows : 6,
      samples: strList(item.samples),
    };
  });
}

function parseScripts(value: unknown, file: string, where: string): ScriptLine[] {
  if (!Array.isArray(value) || value.length === 0) throw new PrintableError(file, `${where} scripts is empty.`);
  return value.map((item) => {
    if (!isObject(item)) throw new PrintableError(file, `${where} scripts must be { to, line }.`);
    return { to: requireStr(item, "to", file, where), line: requireStr(item, "line", file, where) };
  });
}

const BLOCK_TYPES = ["checklist", "fields", "lines", "boxes", "bullets", "scripts", "note"] as const;

function parseBlock(value: unknown, file: string, where: string): SheetBlock {
  if (!isObject(value)) throw new PrintableError(file, `${where} has a block that is not an object.`);
  const types = BLOCK_TYPES.filter((type) => type in value);
  if (types.length !== 1) {
    throw new PrintableError(file, `${where} blocks need exactly one of: ${BLOCK_TYPES.join(", ")}.`);
  }
  const type = types[0];
  const body = value[type];
  switch (type) {
    case "checklist":
      return { type, items: parseChecklist(body, file, where) };
    case "fields":
      return { type, fields: parseFields(body, file, where), twoColumn: value.twoColumn === true };
    case "lines": {
      const count = Number(body);
      if (!Number.isInteger(count) || count < 1 || count > 20) {
        throw new PrintableError(file, `${where} lines must be a number from 1 to 20.`);
      }
      return { type, count, placeholder: str(value.placeholder) || undefined, samples: strList(value.samples) };
    }
    case "boxes":
      return { type, columns: parseBoxes(body, file, where) };
    case "bullets": {
      const items = strList(body);
      if (items.length === 0) throw new PrintableError(file, `${where} bullets is empty.`);
      return { type, items };
    }
    case "scripts":
      return { type, items: parseScripts(body, file, where) };
    case "note": {
      const text = str(body);
      if (!text) throw new PrintableError(file, `${where} note is empty.`);
      return { type, text };
    }
  }
}

function parseSheet(value: unknown, file: string): SheetSection[] {
  if (!Array.isArray(value) || value.length === 0) throw new PrintableError(file, `"sheet" needs at least one section.`);
  return value.map((section, index) => {
    const where = `sheet section ${index + 1}`;
    if (!isObject(section)) throw new PrintableError(file, `${where} must be { title, intro, blocks }.`);
    const title = requireStr(section, "title", file, where);
    if (!Array.isArray(section.blocks) || section.blocks.length === 0) {
      throw new PrintableError(file, `${where} ("${title}") needs blocks.`);
    }
    return {
      title,
      intro: str(section.intro) || undefined,
      blocks: section.blocks.map((block) => parseBlock(block, file, `${where} ("${title}")`)),
    };
  });
}

function parsePrintable(file: string): Printable {
  const { data } = matter(fs.readFileSync(path.join(printablesDir, file), "utf8"));
  const slug = requireStr(data, "slug", file, "frontmatter");
  if (`${slug}.md` !== file) throw new PrintableError(file, `slug "${slug}" must match the file name.`);
  const publishedAt = parseDate(data.publishedAt);
  if (!publishedAt) throw new PrintableError(file, `publishedAt must be YYYY-MM-DD.`);

  const tags = strList(data.tags);
  const unknownTag = tags.find((tag) => !RESOURCE_TAGS.includes(tag as ResourceTag));
  if (unknownTag) throw new PrintableError(file, `unknown tag "${unknownTag}". Use: ${RESOURCE_TAGS.join(", ")}.`);

  const sheet = parseSheet(data.sheet, file);
  const previewItems = strList(data.previewItems).slice(0, 5);
  return {
    slug,
    title: requireStr(data, "title", file, "frontmatter"),
    seoTitle: requireStr(data, "seoTitle", file, "frontmatter"),
    description: requireStr(data, "description", file, "frontmatter"),
    excerpt: requireStr(data, "excerpt", file, "frontmatter"),
    intro: requireStr(data, "intro", file, "frontmatter"),
    printLabel: str(data.printLabel) || "Print sheet",
    guideSlug: requireStr(data, "guideSlug", file, "frontmatter"),
    guideLabel: requireStr(data, "guideLabel", file, "frontmatter"),
    keywords: strList(data.keywords),
    tags: tags as ResourceTag[],
    companionGuideSlugs: strList(data.companionGuideSlugs),
    status: parseStatus(data.status, file),
    publishedAt,
    sheet,
    hasSample: sheetHasSample(sheet),
    previewItems: previewItems.length ? previewItems : sheetPreviewItems(sheet),
  };
}

function readAllPrintables(): Printable[] {
  if (!fs.existsSync(printablesDir)) return [];
  const legacySlugs = new Set(resources.map((resource) => resource.slug));
  return fs
    .readdirSync(printablesDir)
    .filter((file) => file.endsWith(".md") && file === file.toLowerCase())
    .map((file) => {
      const printable = parsePrintable(file);
      if (legacySlugs.has(printable.slug)) {
        throw new PrintableError(file, `slug "${printable.slug}" is already a hand-built printable.`);
      }
      return printable;
    });
}

/** Same rule as guides: drafts never show, scheduled shows from its publishedAt day (UTC). */
function isLive(printable: Printable, now = new Date()): boolean {
  if (printable.status === "draft") return false;
  if (printable.status === "published") return true;
  return now.getTime() >= new Date(`${printable.publishedAt}T00:00:00.000Z`).getTime();
}

/** Every content-file printable, any status. For the pipeline docs and checks, not pages. */
export function getAllPrintablesIncludingDrafts(): Printable[] {
  return readAllPrintables().sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
}

export function getLivePrintables(): Printable[] {
  return readAllPrintables().filter((printable) => isLive(printable));
}

export function getLivePrintable(slug: string): Printable | null {
  return getLivePrintables().find((printable) => printable.slug === slug) ?? null;
}

/** Soonest scheduled printable that isn't live yet, for the "next drop" teaser. */
export function getNextScheduledPrintable(): Printable | null {
  return (
    readAllPrintables()
      .filter((printable) => printable.status === "scheduled" && !isLive(printable))
      .sort((a, b) => a.publishedAt.localeCompare(b.publishedAt))[0] ?? null
  );
}

/** Hand-built and live content-file printables, newest first. */
export function getLiveResources(): Resource[] {
  const fromFiles = getLivePrintables().map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ sheet, status, hasSample, ...resource }): Resource => resource,
  );
  return [...resources, ...fromFiles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getLiveResourceForGuide(guideSlug: string): Resource | null {
  return getLiveResources().find((resource) => resource.guideSlug === guideSlug) ?? null;
}

export function otherLiveResources(slug: string): Resource[] {
  return getLiveResources().filter((resource) => resource.slug !== slug);
}
