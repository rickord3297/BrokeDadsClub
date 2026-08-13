---
name: write-bdc-guide
description: >-
  Drafts Broke Dads Club guides from content/ideas.md into content/guides/*.md.
  Use when the user drops ideas, asks to draft new ideas, write a guide, schedule
  a post, or turn backlog rows into articles.
---

# Write a BDC guide

## Default workflow

When the user drops ideas into `content/ideas.md` or says **Draft new ideas**:

1. Read `content/ideas.md`.
2. For **every** row with Status `idea`, create a draft guide (below).
3. Set those rows to Status `draft` and put the filename in Notes.
4. Refresh `content/DRAFTS.md` so it lists all guides with `status: draft`.

## Draft steps (each idea)

1. Read one existing live guide for voice (prefer `the-47-dollar-grocery-week.md`).
2. Write `content/guides/<slug>.md`:

```yaml
---
title: ...
slug: kebab-case-slug
seoTitle: "Search-friendly title under ~60 chars | Broke Dads Club"
description: "Meta description ~150 chars. Promise the outcome."
excerpt: One or two sentences (card/teaser copy).
category: Money | Time | Kids | Work | Gear
readTime: N min
publishedAt: "YYYY-MM-DD"
status: draft
keywords:
  - search phrase people would type
  - another related phrase
related:
  - other-live-slug
  - another-live-slug
shop:
  - club-patch
  - broke-mug
faq:
  - question: Natural-language question people ask Google?
    answer: Short plain answer for FAQ schema (1-2 sentences).
---
```

3. Use the row’s **Go live** date for `publishedAt` when present; otherwise pick a sensible future Monday and note it in the table.
4. Include 3-6 `keywords` people would actually search (cheap X, how to Y for dads, budget Z).
5. Add `seoTitle`, `description`, 2-3 `faq` items, `related` (live slugs only), and optional `shop` product slugs.
6. Body: short intro → practical sections → calm close. ~600-900 words. Add 1-2 internal links to other `/guides/...` where natural.
7. Always use `status: draft` unless the user asks to schedule or publish now.
8. Do not commit or push unless asked.

## Voice

- Audience: stretched dads. Dignity over shame.
- Tagline energy: *Broke doesn't mean broken.*
- Dry, practical, specific. No hustle-bro, no 4 a.m. grind, no “just budget better.”
- Soft shop links only if the user asks.
- **Never use em dashes or en dashes.** They read as fake/AI. Prefer a period, comma, colon, parentheses, or a plain hyphen in ranges (`15-45`, `$150-$200`). For labeled lists write `**Label:** rest` (colon), not a long dash.
