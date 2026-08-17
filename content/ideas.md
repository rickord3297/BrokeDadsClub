# Content desk

**Daily:** tell Cursor **Scan trends** (or let the morning automation run). That searches what dads and parents are talking about, logs the pass in [`trends.md`](trends.md), and adds only BDC-shaped hooks here as Status `idea`. It does not publish.

**Drop ideas in the table below** (Status `idea`). Then tell Cursor: **Draft new ideas:** every `idea` row becomes a guide file with `status: draft` (not on the live site).

**Review drafts:** open files in [`content/guides/`](guides/), anything with `status: draft` in the top. Or browse [`DRAFTS.md`](DRAFTS.md).

| Idea | Status | Go live | Notes |
|------|--------|---------|-------|
| Which tool brand to buy (one battery, not a shrine) | draft | | [`which-tool-brand-to-buy.md`](guides/which-tool-brand-to-buy.md) |
| Dad math: I can do that cheaper (then you need $200 of tools) | draft | | [`dad-math.md`](guides/dad-math.md) |
| The second bill after school starts (fees, sports, fundraisers) | draft | | [`the-second-bill.md`](guides/the-second-bill.md) |
| Gas station dinner that still counts as feeding your kids | scheduled | 2026-09-01 | [`gas-station-dinner.md`](guides/gas-station-dinner.md) |
| When the other dad’s vacation photos hit | scheduled | 2026-09-08 | [`when-the-other-dads-vacation-photos-hit.md`](guides/when-the-other-dads-vacation-photos-hit.md) |
| Explaining “we can’t go” without making it a speech | live | 2026-08-12 | [`explaining-we-cant-go.md`](guides/explaining-we-cant-go.md) |
| The school supply list that quietly wrecks August | live | 2026-08-14 | [`school-supply-list.md`](guides/school-supply-list.md) |
| Cheap weekend that isn’t just screen time | scheduled | 2026-09-22 | [`cheap-weekend-not-just-screens.md`](guides/cheap-weekend-not-just-screens.md) |
| What to say when someone asks what you do for fun | scheduled | 2026-09-29 | [`what-do-you-do-for-fun.md`](guides/what-do-you-do-for-fun.md) |
| Fixing the car vs paying for daycare: picking the lesser disaster | live | 2026-08-12 | [`car-vs-daycare.md`](guides/car-vs-daycare.md) |
| Birthday party math for kids who notice everything | live | 2026-08-12 | [`birthday-party-math.md`](guides/birthday-party-math.md) |
| The kid who won't sleep | scheduled | 2026-10-06 | [`the-kid-who-wont-sleep.md`](guides/the-kid-who-wont-sleep.md) |
| How to handle the early riser | scheduled | 2026-10-13 | [`how-to-handle-the-early-riser.md`](guides/how-to-handle-the-early-riser.md) |
| Kids who don't listen to Mom | scheduled | 2026-10-20 | [`kids-who-dont-listen-to-mom.md`](guides/kids-who-dont-listen-to-mom.md) |
| The $47 grocery week | live | 2026-08-04 | `the-47-dollar-grocery-week` |
| Cheap date night that still feels like a date | live | 2026-07-28 | `cheap-date-night` |
| The dad tax: why everything costs more | live | 2026-07-21 | `the-dad-tax` |
| Side hustles that don't steal bedtime | live | 2026-07-14 | `side-hustles-that-dont-steal-bedtime` |
| Talking to kids about money without scaring them | live | 2026-07-07 | `talking-to-kids-about-money` |
| Thrift without looking like a dare | live | 2026-06-30 | `thrift-without-looking-like-a-dare` |
| My retirement can wait: $25/week in VTI for 30 years | scheduled | 2026-10-27 | [`retirement-can-wait.md`](guides/retirement-can-wait.md) |

### Status

| Status | Meaning |
|--------|---------|
| `idea` | Just dropped, ask Cursor to draft it |
| `draft` | Written file, **hidden** from the website |
| `scheduled` | Ready; goes live on **Go live** date after you push |
| `live` | Public |

### Go live

When a draft is ready: set the guide’s frontmatter to `status: scheduled` (or `published`), keep/adjust `publishedAt`, update this table, then commit + push.
