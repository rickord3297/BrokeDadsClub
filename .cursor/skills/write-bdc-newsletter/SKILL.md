---
name: write-bdc-newsletter
description: >-
  Writes Broke Dads Club Sunday Dispatch issues in content/newsletter/*.md and
  runs the weekly newsletter cadence. Use when the user asks for a newsletter
  issue, the Sunday Dispatch, "next issue", or a scheduled "Publish newsletter"
  automation runs.
---

# Write the Sunday Dispatch

Each issue is one markdown file: `content/newsletter/NNN-<slug>.md`. Frontmatter holds the issue data, the body is the Sunday Note. The site archive (`/newsletter`), the issue page, and the Sunday email are all built from the file.

## How it goes out

- The Dispatch is website-only for now. An issue appears on `/newsletter` on its `publishedAt` date (pages refresh hourly, no deploy needed).
- Email sending is built but switched off until an email provider is configured (`/api/cron/weekly-recap` returns 503 without SES keys). When it is on, it sends the issue dated that Sunday at 9 a.m. Central.
- So the issue must be **on `main` before Saturday evening**, dated that Sunday.

## Weekly pass (Thursdays)

When the user says **newsletter cadence**, **next issue**, or the **Publish newsletter** automation runs:

1. Start from latest `origin/main`. Branch `cursor/newsletter-<slug>-XXXX`.
2. Find the coming Sunday (if today is Sunday, use next Sunday).
3. If an issue is already dated that Sunday, stop. Do not open a PR.
4. Read the last two issues (do not repeat their topics or deals), then the guides and printables that will be **live by that Sunday**: `content/guides/*.md` and `content/printables/*.md` with `status: published`, or `scheduled` with `publishedAt <= Sunday`.
5. Pick the lead:
   - Prefer a guide that went live or was meaningfully updated in the last 7 days, or one that fits the season (the next two weeks of a dad's calendar: school breaks, holidays, sports seasons, bills).
   - The Sunday Note gives one tactic from it, with the guide's real numbers. Never invent a statistic or a reader quote.
6. Write the file (format below). `issueNumber` = highest existing + 1, file prefix zero-padded to 3.
7. Run `npm run build`. Bad merchants or deal links fail the build.
8. Commit only the new `content/newsletter/*` file. Push and open a PR whose title **starts with** `Publish newsletter:`. The GitHub Action auto-merges it once checks pass. Do not ask the user to merge.

One issue per Sunday. Never date an issue on a day that is not a Sunday.

## File format

```yaml
---
slug: kebab-case-slug                 # matches the file name after the number
issueNumber: 4
title: Short headline, sentence case   # "&" is fine, no dashes
publishedAt: "YYYY-MM-DD"             # a Sunday, quoted
readTime: 4 min
excerpt: >-
  One or two sentences. Shows on the archive card and as the email preview text.
takeaways:                             # exactly 3, quoted, one sentence each
  - "Concrete thing to do or number to know."
featuredGuideSlug: live-guide-slug     # usually the lead
featuredGuideNote: >-
  1-2 sentences on why this guide, this week.
whatYouMissed:                         # 2-3 items, all live by publishedAt
  - title: Exact page title
    href: /guides/slug                 # or /resources/slug or /shop/slug
    type: guide                        # guide | printable | shop
    description: One sentence, concrete.
deals:                                 # exactly 3, tied to the lead topic
  - title: Plain product name
    merchant: Amazon                   # must be an approved merchant (src/lib/affiliate.ts)
    targetPrice: Under $25
    note: What makes it worth it, or what to skip. One or two sentences.
    url: https://www.amazon.com/s?k=search+terms   # search URL or ASIN
---

Body: the Sunday Note.
```

### Sunday Note body

- 150-250 words. 3 to 5 short paragraphs.
- Open with the problem in a concrete moment ("Thursday at 5:40 p.m."), not a greeting.
- One tactic, **bolded** once or twice. Link the guide or printable inline with a relative link.
- End with one thing to do this week, then `See you next Sunday.` on its own line.
- Only paragraphs, bold, links, bullet lists, and `>` quotes. No tables or images (the email renderer does not support them).

### Deals

- Three items that serve the lead tactic. Things a dad would actually use, not gadgets.
- Target prices a real listing hits. "Under $X" beats exact prices that go stale.
- Search URLs (`https://www.amazon.com/s?k=...`) are fine when there is no specific ASIN.

## Voice

Same as `.cursor/skills/write-bdc-guide/SKILL.md`:

- Dignity over shame. Dry, practical, specific. No hustle-bro, no "hey fam".
- **Never use em dashes or en dashes.** Use "to" or a hyphen for ranges.
- Real numbers from the guides. Do not make up readers, quotes, or stats.

## Checklist before opening the PR

- [ ] `publishedAt` is a Sunday and no other issue uses it
- [ ] `issueNumber` is the next number; file name prefix matches
- [ ] Every `whatYouMissed` href and `featuredGuideSlug` is live by `publishedAt`
- [ ] Lead topic and deals differ from the last two issues
- [ ] No em or en dashes anywhere in the file
- [ ] `npm run build` passes
