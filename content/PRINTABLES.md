# Printables desk

Printables live in `src/lib/resources.ts` and render at `/resources/[slug]`. They are **live on deploy** (no draft/scheduled status like guides).

**Fillable sheets** save field values in this browser via localStorage (per device).

## Published (9)

| Tool | Slug | Priority |
|------|------|----------|
| Solo parent / sitter hand-off card | `sitter-handoff-card` | P1 Routines |
| Morning launchpad door checklist | `morning-launchpad-checklist` | P1 Routines |
| Rainy day $0 play matrix | `rainy-day-play-matrix` | P1 Routines |
| Can we afford it? decision sheet | `can-we-afford-it-flowchart` | P2 Wallet |
| Subscription and auto-renew burn sheet | `subscription-burn-sheet` | P2 Wallet |
| Youth sports true-cost estimator | `youth-sports-true-cost` | P2 Wallet |
| The $47 grocery-week checklist | `grocery-week-checklist` | (original) |
| School supply triage sheet | `school-supply-triage` | (original) |
| Birthday party budget sheet | `birthday-party-budget` | (original) |

## Backlog (not built)

| Idea | Priority |
|------|----------|
| Quarterly home defense checklist | P3 Home |
| Glovebox vehicle emergency run-sheet | P3 Home |
| Paycheck runway worksheet (weeks of must-pay coverage) | P2 (SEO) |

## Add a printable

1. Add metadata to `resources` in `src/lib/resources.ts`.
2. Create sheet UI in `src/components/resource-sheets/`.
3. Register slug in `src/components/resource-sheets/registry.tsx`.
4. Add sample block in `src/components/resource-sample.tsx` (optional).
5. Deploy.
