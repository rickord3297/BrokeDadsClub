import { FillCheck, FillLine } from "@/components/fillable-fields";
import type { SheetBlock, SheetSection } from "@/lib/printable-model";

/** Renders a content-file printable with the same fields as the hand-built sheets. */
export function PrintableSheet({ sheet }: { sheet: SheetSection[] }) {
  return (
    <div className="space-y-10 print:space-y-5">
      {sheet.map((section) => (
        <div key={section.title} className="break-inside-avoid">
          <h2 className="font-display text-3xl">{section.title}</h2>
          {section.intro ? (
            <p className="mt-3 text-base leading-7 text-ink-soft">{section.intro}</p>
          ) : null}
          <div className="mt-4 space-y-5">
            {section.blocks.map((block, blockIndex) => (
              <Block
                key={blockIndex}
                block={block}
                name={`${section.title}${section.blocks.length > 1 ? ` ${blockIndex + 1}` : ""}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Block({ block, name }: { block: SheetBlock; name: string }) {
  switch (block.type) {
    case "checklist":
      return (
        <ul className="space-y-2">
          {block.items.map((item, index) => (
            <FillCheck key={index} name={`${name}-${index}`} sampleChecked={item.sample}>
              {item.label}
            </FillCheck>
          ))}
        </ul>
      );
    case "fields":
      return (
        <div className={block.twoColumn ? "grid gap-x-6 sm:grid-cols-2" : undefined}>
          {block.fields.map((field, index) => (
            <FillLine
              key={index}
              name={`${name}-${index}`}
              label={field.label}
              placeholder={field.placeholder}
              sample={field.sample}
              wide
            />
          ))}
        </div>
      );
    case "lines":
      return (
        <div>
          {Array.from({ length: block.count }, (_, index) => (
            <FillLine
              key={index}
              name={`${name}, line ${index + 1}`}
              placeholder={index === 0 ? block.placeholder : undefined}
              sample={block.samples?.[index]}
            />
          ))}
        </div>
      );
    case "boxes":
      return (
        <div className={`grid gap-4 ${block.columns.length > 1 ? "sm:grid-cols-2" : ""} ${block.columns.length > 2 ? "lg:grid-cols-3" : ""}`}>
          {block.columns.map((column) => (
            <div key={column.title} className="rounded-xl border border-rule p-4 print:border-black/40">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-rust">{column.title}</p>
              {column.hint ? <p className="mt-1 text-sm leading-6 text-ink-soft">{column.hint}</p> : null}
              {Array.from({ length: column.rows }, (_, index) => (
                <FillLine
                  key={index}
                  name={`${column.title}, row ${index + 1}`}
                  sample={column.samples?.[index]}
                />
              ))}
            </div>
          ))}
        </div>
      );
    case "bullets":
      return (
        <ul className="list-disc space-y-2 pl-5 text-base leading-7">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "scripts":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {block.items.map((script) => (
            <div key={script.to} className="rounded-xl border border-rule p-4 print:border-black/40">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-rust">{script.to}</p>
              <p className="mt-2 text-base leading-7">&ldquo;{script.line}&rdquo;</p>
            </div>
          ))}
        </div>
      );
    case "note":
      return (
        <p className="rounded-xl border-2 border-ink/30 p-4 text-base leading-7 print:border-black">
          {block.text}
        </p>
      );
  }
}
