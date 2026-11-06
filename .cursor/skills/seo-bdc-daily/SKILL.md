---
name: seo-bdc-daily
description: >-
  Daily SEO and conversion health check for Broke Dads Club. Use when a scheduled
  "Daily SEO" automation runs, or the user asks to audit titles, metas, internal
  links, indexing readiness, or CTR fixes.
---

# Daily SEO health check

Keep this **light**. One focused PR when something real needs fixing. No redesigns. No mass republishes.

## Goals

1. Catch missing or weak SEO fields on live/soon-live guides and printables.
2. Strengthen internal links so new and seasonal pages get crawl depth.
3. Surface conversion gaps on high-intent pages (grocery signup, thank-you, top guides).
4. Leave a short note for Monday's owner digest if GSC-style follow-up is needed.

## Steps

1. Start from latest `origin/main`. Branch `cursor/seo-<short>-XXXX` only if you will open a PR.
2. Read live and scheduled-soon content:
   - `content/guides/*.md` with `status: published`, or `scheduled` with `publishedAt` within 7 days
   - `content/printables/*.md` the same way
   - `src/app/sitemap.ts` (or sitemap route) and `src/lib/guide-catalog.ts`
3. Audit checklist (fix a short list; do not invent traffic numbers):
   - Guide missing `seoTitle` or `description`, or description clearly over ~160 characters of fluff
   - Guide with empty `related` or no Keep Going hook in `guide-catalog.ts`
   - New guide live in the last 7 days that older seasonal guides never link to
   - Printable live without a clear path from its paired guide
   - Homepage / grocery landing CTA copy that no longer matches the live lead magnet
4. Fix **at most 3 concrete items**. Prefer:
   - Title / description rewrites that match real search intent (dad tax, grocery week, book fair, etc.)
   - 2–4 internal links or related-slug updates
   - One signup/CTA wording fix on an existing page
5. If nothing needs fixing, stop. Do **not** open an empty PR. Optionally append one line to `content/trends.md` under an `seo YYYY-MM-DD:` note.
6. If you fixed something: run `npm run build`, commit only the touched content/code files, push, open a PR titled exactly:
   `SEO: <short fix summary>`
7. Do not merge. Do not change newsletter issues, merch, or env files.

## Rules

- No em or en dashes in copy you write.
- Do not invent impressions, rankings, or "readers say" claims.
- Do not request indexing for every URL. If you list GSC follow-ups for the owner, cap at 5 URLs.
- Voice stays dry and practical. Titles can be specific; they should not sound like spam.
