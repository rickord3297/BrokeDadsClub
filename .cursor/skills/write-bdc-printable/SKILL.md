---
name: write-bdc-printable
description: >-
  Builds Broke Dads Club printables as content files in content/printables/*.md
  and runs the weekly Friday printable cadence. Use when the user asks for a new
  printable, worksheet, checklist, fillable sheet, or "free tool", wants to fill
  the printable queue, or a scheduled "Publish printable" automation runs.
---

# Write a BDC printable

Printables are one markdown file each in `content/printables/<slug>.md`. All content lives in YAML frontmatter. The site renders the fillable sheet (`src/components/printable-sheet.tsx`), thumbnail, sitemap entry, guide tie-ins, and "More free tools" links from the file. Do not hand-build a React page for a new printable.

The queue and backlog live in `content/printables/IDEAS.md`.

## Weekly publish pass (Fridays)

When the user says **printable cadence**, **weekly printable**, or the **Publish printable** automation runs:

1. Start from latest `origin/main`. Branch `cursor/printable-<slug>-XXXX`.
2. Catch up: any printable with `status: scheduled` and `publishedAt <= today` → `status: published`. Update the Queue table in `IDEAS.md`.
3. If nothing went live in the last 7 days, publish the next one today:
   - Prefer the soonest future `scheduled` printable: set `publishedAt` to today, `status: published`.
   - Else build the next `idea` row (seasonal rows that are due first, then oldest) with `publishedAt: today`, `status: published`.
4. Keep at least **two future** scheduled printables, one per Friday (`next Friday`, `the Friday after`). Build from idea rows if the queue is thin. Use `status: scheduled`.
5. If the backlog has fewer than 4 `idea` rows, add 2-3 new rows. Each must pair with a **live** guide in `content/guides/`. Ideas that need a guide first get `needs a guide first` in the guide column.
6. Run `npm run build`. A bad printable file fails the build with the file name and the problem. Fix it before opening the PR.
7. Commit only `content/printables/*`. Push and open/update a PR whose title **starts with** `Publish printable:` (required for `.github/workflows/auto-publish-guides.yml` to auto-merge).

One printable per Friday. Never stack several go-lives on one day unless catching up a broken queue.

## Picking the idea

- It pairs with a **live** guide (`status: published`, or scheduled on or before the printable's date). The printable is the working copy; the guide is the thinking.
- One page. A dad should fill it in under five minutes, in the car or at the counter.
- Something you write a number, a name, or a check on. Not a poster of tips.
- Do not repeat a live printable (`src/lib/resources.ts` plus `content/printables/*.md`).

## File format

```yaml
---
slug: kebab-case-slug            # must match the file name
status: scheduled                # draft | scheduled | published
publishedAt: "YYYY-MM-DD"        # a Friday
title: Short sheet name           # card + h1, no "free printable"
seoTitle: "Free <Search Phrase> Printable (for Parents)"   # under ~65 chars
description: >-
  Meta description, 140-160 chars. Say what is on the sheet.
excerpt: >-
  One or two sentences for the card. Concrete, dry.
intro: >-
  How to use it: what to fill first, where it lives (fridge, car, phone).
printLabel: Print <noun>         # button label
guideSlug: live-guide-slug
guideLabel: the guide title in lower case   # reads after "Full write-up:"
previewItems: [Four or five, short labels, for the thumbnail]
keywords:
  - search phrase people type + printable / worksheet / checklist
tags: [5-Min Prep, Single-Page, Seasonal, Fillable]   # only these: also Ink-Friendly
companionGuideSlugs:
  - other-live-guide
sheet:
  - title: Section heading
    intro: Optional one-line instruction.
    blocks:
      - twoColumn: true          # optional, for short fields
        fields:
          - { label: Short label, placeholder: hint, sample: "filled example" }
      - checklist:
          - { label: Checked in the sample, sample: true }
          - Plain item, unchecked in the sample
      - lines: 3                 # blank write lines
        placeholder: hint on the first line
        samples: [first line sample, second]
      - boxes:                   # 2-3 sorting columns
          - { title: Keep, hint: optional, rows: 4, samples: [a, b] }
      - bullets:
          - Static list (do-not-buy, rules)
      - scripts:
          - { to: To your kid, line: "Short line a tired dad would say." }
      - note: One bordered callout, a rule or a source line.
---
```

Each block has exactly one of `fields`, `checklist`, `lines`, `boxes`, `bullets`, `scripts`, `note`.

### YAML traps

- Inside `{ ... }` a comma ends the value. Quote any value with a comma, colon, `#`, or a leading `$`/`*`/`&`: `sample: "$365.40"`, `line: "Not this season, sorry."`.
- Same inside `[ ... ]` lists: `["Monday: Grandma", "Program, person, or day off"]`.
- Field labels sit in a fixed-width column. Keep them to about 18 characters.

### Samples

Give most fields, checks, lines, and box rows a `sample` so the "Filled sample" toggle shows a believable, specific example (real-sounding names, round numbers, dates in the right season). If no block has a sample, the toggle hides itself. Sample math must add up.

## Voice

Same rules as `.cursor/skills/write-bdc-guide/SKILL.md`:

- Dignity over shame. Dry, practical, specific. No hustle-bro.
- **Never use em dashes or en dashes.** Use "to" or a hyphen for ranges.
- Scripts under ~15 words, how people actually talk. Reuse the paired guide's scripts and numbers when they exist. Do not invent statistics; cite the guide's source if you repeat one.

## Checklist before opening the PR

- [ ] `slug` matches the file name and is not already used
- [ ] `guideSlug` is live on or before `publishedAt`
- [ ] `publishedAt` is a Friday, one printable per Friday
- [ ] Sample values make sense together (totals add up, dates in season)
- [ ] `IDEAS.md` Queue and backlog rows updated
- [ ] `npm run build` passes
