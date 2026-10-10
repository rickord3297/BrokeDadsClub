# Printable pipeline

One new printable goes live every **Friday**. Each one is a single file in this folder, paired with a live guide. The site builds the fillable page, the thumbnail, the sitemap entry, and the "More free tools" links from the file. No React needed.

- Schema and examples: any `*.md` next to this file. Validation lives in `src/lib/printables.ts` and fails the build on a bad file.
- Status works like guides: `draft` never shows, `scheduled` goes live on its `publishedAt` day (UTC), `published` is live.
- Skill: `.cursor/skills/write-bdc-printable/SKILL.md`. Automation prompt: `content/AUTOMATIONS.md`.

## Queue

| Go live (Fri) | Status | Printable | Pairs with guide |
|---|---|---|---|
| 2026-10-07 | published | `halloween-costume-cap-card` | one-halloween-costume-not-three-events |
| 2026-10-16 | scheduled | `fall-break-coverage-plan` | the-week-school-closes-and-work-does-not |
| 2026-10-23 | scheduled | `winter-heat-number-card` | the-heat-bill-before-it-gets-cold |
| 2026-10-30 | scheduled | `youth-sports-all-in-worksheet` | youth-sports-all-in-cost-checklist |

## Ideas backlog

Status `idea` rows get built by the weekly pass, oldest first, unless a seasonal row is due sooner. A row needs a **live** guide to pair with. If the guide is not live yet, skip the row until it is.

| Status | Printable idea | Pairs with guide | Season / timing | Notes |
|---|---|---|---|---|
| idea | Lunch week planner: five boxes, one backup lunch, the "good enough" list | packing-school-lunch-without-a-guilt-spiral | Any school week | |
| idea | Dad tax tracker: one week of small asks, who asked, what it cost | dad-tax-examples-the-small-asks-that-stack | Any | Good newsletter tie-in |
| idea | Second grocery trip guard card: the three reasons you are allowed back in | second-grocery-trip-blows-the-week | Any | Pairs with grocery checklist |
| idea | Early riser morning card: wake light time, quiet box list, first words | how-to-handle-the-early-riser | Daylight saving ends Nov 1 | Ship by 2026-10-30 if possible |
| idea | After-school reset card: snack, quiet 20, one question | the-after-school-collapse-is-not-a-bad-kid | Any school week | |
| idea | Activity cut worksheet: every weekly activity, hours, cost, keep or drop | dropping-one-activity-so-the-week-can-breathe | Winter signups (Nov) | |
| idea | NFL home watch party budget sheet: guest count, food per head, cap | nfl-home-watch-party-on-a-budget | Thanksgiving week / playoffs | |
| idea | Team parent "no" card: what you will do, what you will not, the script | dont-say-yes-to-team-parent-first-huddle | Winter season start | |
| idea | First injury plan card: urgent care vs ER, insurance numbers, who picks up | kids-first-injury-support | Any | No medical advice beyond the guide |
| idea | Holiday gift cap sheet: per kid cap, one want / one need / one read | needs a guide first | Before Black Friday (Nov 27) | Flag for the guide pipeline |
| idea | Thanksgiving potluck budget: what we bring, the cap, the leftover plan | needs a guide first | By Nov 20 | Flag for the guide pipeline |
