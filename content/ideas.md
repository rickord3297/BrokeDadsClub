# Content desk

**Daily:** tell Cursor **Scan trends** (or let the morning automation run). That searches what dads and parents are talking about, logs the pass in [`trends.md`](trends.md), and adds only BDC-shaped hooks here as Status `idea`. It does not publish.

**Drop ideas in the table below** (Status `idea`). Then tell Cursor: **Draft new ideas:** every `idea` row becomes a guide file with `status: draft` (not on the live site).

**Review drafts:** open files in [`content/guides/`](guides/), anything with `status: draft` in the top. Or browse [`DRAFTS.md`](DRAFTS.md).

| Idea | Status | Go live | Notes |
|------|--------|---------|-------|
| The lonely dad at practice | live | 2026-08-26 | [`the-lonely-dad.md`](guides/the-lonely-dad.md) |
| The pickup line is not a networking event | live | 2026-08-27 | [`the-pickup-line-is-not-a-networking-event.md`](guides/the-pickup-line-is-not-a-networking-event.md) |
| When you yelled and you are the last one awake | live | 2026-08-28 | [`when-you-yelled-and-youre-the-last-one-awake.md`](guides/when-you-yelled-and-youre-the-last-one-awake.md) |
| The sports signup fee you did not budget for | live | 2026-08-29 | [`the-sports-signup-fee-you-didnt-budget-for.md`](guides/the-sports-signup-fee-you-didnt-budget-for.md) |
| Tagging along without becoming furniture | live | 2026-08-30 | [`tagging-along-without-becoming-furniture.md`](guides/tagging-along-without-becoming-furniture.md) |
| One dad coffee, not a friend group | live | 2026-08-30 | [`one-dad-coffee-not-a-friend-group.md`](guides/one-dad-coffee-not-a-friend-group.md) |
| The after-school collapse is not a bad kid | live | 2026-08-30 | [`the-after-school-collapse-is-not-a-bad-kid.md`](guides/the-after-school-collapse-is-not-a-bad-kid.md) |
| Packing school lunch without a $12 guilt spiral | scheduled | 2026-08-31 | [`packing-school-lunch-without-a-guilt-spiral.md`](guides/packing-school-lunch-without-a-guilt-spiral.md) |
| Dropping one activity so the week can breathe | scheduled | 2026-08-31 | [`dropping-one-activity-so-the-week-can-breathe.md`](guides/dropping-one-activity-so-the-week-can-breathe.md) |
| Which tool brand to buy (one battery, not a shrine) | live | 2026-08-22 | [`which-tool-brand-to-buy.md`](guides/which-tool-brand-to-buy.md) |
| Dad math: I can do that cheaper (then you need $200 of tools) | live | 2026-08-16 | [`dad-math.md`](guides/dad-math.md) |
| The second bill after school starts (fees, sports, fundraisers) | live | 2026-08-16 | [`the-second-bill.md`](guides/the-second-bill.md) |
| Gas station dinner that still counts as feeding your kids | live | 2026-08-22 | [`gas-station-dinner.md`](guides/gas-station-dinner.md) |
| When the other dad’s vacation photos hit | scheduled | 2026-09-08 | [`when-the-other-dads-vacation-photos-hit.md`](guides/when-the-other-dads-vacation-photos-hit.md) |
| Explaining “we can’t go” without making it a speech | live | 2026-08-12 | [`explaining-we-cant-go.md`](guides/explaining-we-cant-go.md) |
| The school supply list that quietly wrecks August | live | 2026-08-14 | [`school-supply-list.md`](guides/school-supply-list.md) |
| Cheap weekend that isn’t just screen time | live | 2026-08-22 | [`cheap-weekend-not-just-screens.md`](guides/cheap-weekend-not-just-screens.md) |
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

### Status

| Status | Meaning |
|--------|---------|
| `idea` | Just dropped, ask Cursor to draft it |
| `draft` | Written file, **hidden** from the website |
| `scheduled` | Ready; goes live on **Go live** date after you push |
| `live` | Public |

### Go live

When a draft is ready: set the guide’s frontmatter to `status: scheduled` (or `published`), keep/adjust `publishedAt`, update this table, then commit + push.
