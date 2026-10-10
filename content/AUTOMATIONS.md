# Content automations

Broke Dads Club uses Cursor Automations plus one GitHub Action.

## Cadence

| Job | How often | What it does |
|-----|-----------|--------------|
| Daily dad trend scan | Daily | Adds `idea` rows only. Opens a normal PR. Does **not** publish. |
| Publish guide (every 3 days) | Every 3 days | Drafts/schedules/publishes the next guide. Opens a PR titled `Publish guide: …`. |
| Publish printable (weekly) | Fridays | Keeps one new printable going live per Friday from `content/printables/`. Opens a PR titled `Publish printable: …`. |
| `auto-publish-guides` GitHub Action | Daily + on publish PRs | Squash-merges open PRs whose title starts with `Publish guide:` or `Publish printable:` (or branch `cursor/publish-*` / `cursor/printable-*`). |

Scheduled guides on `main` with `status: scheduled` and `publishedAt <= today` go live on the site automatically after deploy. Scheduled printables do the same; `/resources` and `/resources/<slug>` refresh hourly, so a printable goes live on its date even without a deploy.

## Cursor automation prompt: Publish guide (every 3 days)

Create (or edit) a Cursor Automation on a **every 3 days** schedule. Paste this as the prompt:

```text
Broke Dads Club — every-3-day publish pass.

Follow `.cursor/skills/write-bdc-guide/SKILL.md` section "Every 3 days publish pass".

Goals:
1. Keep about one new guide going live every 3 days.
2. Open a pull request whose title MUST start with exactly: Publish guide:
3. Push the branch and create/update that PR. The repo GitHub Action auto-merges Publish guide PRs.

Steps:
1. Fetch and checkout latest origin/main. Create branch cursor/publish-<short-slug>-79d1 (use the repo's required branch suffix if different).
2. Read content/ideas.md, content/DRAFTS.md, and all content/guides/*.md frontmatter.
3. Catch up: any guide with status scheduled and publishedAt <= today → set status published, update ideas.md / DRAFTS.md.
4. If the latest LIVE publishedAt is 3+ days ago (or there is no guide live/scheduled for today), publish the next piece:
   - Prefer the soonest future scheduled guide: move publishedAt to today and set status published (or scheduled for today).
   - Else draft the oldest Status idea row into a full guide (write-bdc-guide draft steps) with publishedAt today and status published.
   - Else run a short trend scan, keep ONE BDC idea, draft it, publish today.
5. Ensure the schedule still has at least two FUTURE guides on the every-3-day rhythm (today+3, today+6, …). Draft from ideas or a quick scan if the pipeline is thin. Use status scheduled.
6. Refresh content/DRAFTS.md and content/ideas.md. Add Keep Going hooks in src/lib/guide-catalog.ts for new slugs.
7. Commit, push, open/update a PR titled: Publish guide: <short title>
8. Do not open trend-only idea PRs in this job. Do not ask the user to merge; the Action merges Publish guide PRs.

Voice and formatting rules in the skill still apply (no em/en dashes, scripts as blockquotes, etc.).
```

## Cursor automation prompt: Publish printable (weekly)

Create a Cursor Automation on a **weekly, Friday morning** schedule. Paste this as the prompt:

```text
Broke Dads Club: weekly printable pass.

Follow `.cursor/skills/write-bdc-printable/SKILL.md` section "Weekly publish pass (Fridays)".

Goals:
1. Keep one new printable going live every Friday.
2. Keep at least two future Fridays scheduled in content/printables/.
3. Open a pull request whose title MUST start with exactly: Publish printable:
   The repo GitHub Action auto-merges Publish printable PRs once checks pass.

Steps:
1. Fetch and checkout latest origin/main. Create branch cursor/printable-<short-slug>-79d1 (use the repo's required branch suffix if different).
2. Read content/printables/IDEAS.md, every content/printables/*.md, and the frontmatter of content/guides/*.md.
3. Catch up: printables with status scheduled and publishedAt <= today become status published.
4. If nothing went live in the last 7 days, publish the soonest scheduled printable today, or build the next idea row and publish it today.
5. Build idea rows into new files until two future Fridays are scheduled. Pair each with a live guide.
6. If the backlog has fewer than 4 idea rows, add 2-3 that pair with live guides.
7. Update the Queue and backlog tables in IDEAS.md.
8. Run npm run build. Fix any printable validation error it reports.
9. Commit only content/printables/*. Push, then open/update a PR titled: Publish printable: <title>
10. Do not edit guides or site code in this job. Do not ask the user to merge.

Voice rules from the skill apply (no em/en dashes, short scripts, real numbers from the paired guide).
```

## Cursor automation prompt note: Daily trend scan

Keep the daily scan as ideas-only. Do **not** add publish instructions there, or you will get a flood of content PRs.

## One-time catch-up

If publish PRs sat unmerged, merge the latest `Publish guide:` PR (or the cadence catch-up PR) so overdue `publishedAt` dates land on `main`. After that, the Action + every-3-day automation keep the site moving.
