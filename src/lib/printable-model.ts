/** Content-file printable shapes, safe for client components. */

import type { Resource } from "@/lib/resources";

export type PrintableStatus = "draft" | "scheduled" | "published";

export type ChecklistItem = { label: string; sample?: boolean };
export type FieldItem = { label: string; placeholder?: string; sample?: string };
export type BoxColumn = { title: string; hint?: string; rows: number; samples?: string[] };
export type ScriptLine = { to: string; line: string };

/** One block inside a sheet section. Authored in frontmatter as `- <type>: ...`. */
export type SheetBlock =
  | { type: "checklist"; items: ChecklistItem[] }
  | { type: "fields"; fields: FieldItem[]; twoColumn: boolean }
  | { type: "lines"; count: number; placeholder?: string; samples?: string[] }
  | { type: "boxes"; columns: BoxColumn[] }
  | { type: "bullets"; items: string[] }
  | { type: "scripts"; items: ScriptLine[] }
  | { type: "note"; text: string };

export type SheetSection = { title: string; intro?: string; blocks: SheetBlock[] };

export type Printable = Resource & {
  status: PrintableStatus;
  publishedAt: string;
  sheet: SheetSection[];
  /** True when any field or checkbox carries a sample value, which turns on the "Filled sample" toggle. */
  hasSample: boolean;
};

export function sheetHasSample(sheet: SheetSection[]): boolean {
  return sheet.some((section) =>
    section.blocks.some((block) => {
      switch (block.type) {
        case "checklist":
          return block.items.some((item) => item.sample);
        case "fields":
          return block.fields.some((field) => field.sample);
        case "lines":
          return Boolean(block.samples?.length);
        case "boxes":
          return block.columns.some((column) => column.samples?.length);
        default:
          return false;
      }
    }),
  );
}

/** Thumbnail labels when frontmatter has no `previewItems`: checklist items first, then field labels. */
export function sheetPreviewItems(sheet: SheetSection[], limit = 5): string[] {
  const blocks = sheet.flatMap((section) => section.blocks);
  const checklist = blocks.flatMap((block) =>
    block.type === "checklist" ? block.items.map((item) => item.label) : [],
  );
  const fields = blocks.flatMap((block) =>
    block.type === "fields" ? block.fields.map((field) => field.label) : [],
  );
  return [...checklist, ...fields].slice(0, limit);
}
