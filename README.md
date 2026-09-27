# Broke Dads Club

eCommerce and content platform for [brokedadsclub.com](https://brokedadsclub.com).

Repo: [github.com/rickord3297/BrokeDadsClub](https://github.com/rickord3297/BrokeDadsClub)

- **Guides** live in `content/guides` as Markdown (edit in Git / Cursor).
- **Products, subscribers, and orders** live in Supabase when you connect it.
- **Checkout** is Stripe. Until keys are set, the shop still works locally with seed products.
- **Host** on Vercel. **DNS** stays in Route 53.
- **Uptime:** the live site does not need new posts or deploys to stay online. See [Stay live without updates](#stay-live-without-updates).

The site runs without Supabase or Stripe. Connect them when you are ready to take real orders and emails.

## Guides

- **Daily scan:** say **Scan trends** (or run the morning automation). It logs the pass in [`content/trends.md`](content/trends.md) and adds only BDC-shaped hooks to [`content/ideas.md`](content/ideas.md). It does not publish.
- **Desk:** [`content/ideas.md`](content/ideas.md) — log ideas, set **Go live** dates, track status.
- **Draft:** in Cursor say **Write a BDC guide from …** (skill: `.cursor/skills/write-bdc-guide`).
- **Files:** `content/guides/*.md` — use frontmatter `status: draft | scheduled | published` and `publishedAt`.
- Scheduled posts appear on the go-live date after you push (site rechecks about hourly).

## Local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 1. GitHub

This project is already connected to `rickord3297/BrokeDadsClub`. After local commits:

```bash
git push origin main
```

## 2. Supabase

Project: [Broke Dads Club](https://rbkzgzrdawxlfdbcqpom.supabase.co) (`rbkzgzrdawxlfdbcqpom`)

1. Local: copy `.env.example` → `.env.local` and fill `NEXT_PUBLIC_SUPABASE_ANON_KEY` (and optional `SUPABASE_SERVICE_ROLE_KEY` for Stripe order webhooks).
2. Vercel → Project → **Settings → Environment Variables** (Production):
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://rbkzgzrdawxlfdbcqpom.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Project Settings → API → `anon` `public`
   - `SUPABASE_SERVICE_ROLE_KEY` = Project Settings → API → `service_role` (server only; never `NEXT_PUBLIC_`)
   - `NEXT_PUBLIC_SITE_URL` = `https://brokedadsclub.com`
3. Redeploy after saving env vars.

Tables already created: `products`, `subscribers`, `orders` (+ seed catalog).

## 3. Stripe

1. Create a Stripe account (test mode first).
2. Add `STRIPE_SECRET_KEY` (and optional publishable key).
3. After the site is on Vercel, add an endpoint:

   `https://brokedadsclub.com/api/webhooks/stripe`

   Event: `checkout.session.completed`. Paste the signing secret into `STRIPE_WEBHOOK_SECRET`.

Prices are created on the fly at checkout. You do not need Stripe product IDs for the first merch drop.

## 4. Vercel

1. Import [rickord3297/BrokeDadsClub](https://github.com/rickord3297/BrokeDadsClub).
2. Add the same env vars as `.env.example`.
3. Set `NEXT_PUBLIC_SITE_URL` to `https://brokedadsclub.com`.
4. Deploy.

## 5. Route 53 → Vercel

Keep the domain in Route 53. Point it at Vercel; do not move the registrar unless you want to.

1. Vercel → Project → **Settings → Domains** → add `brokedadsclub.com` and `www.brokedadsclub.com`.
2. Vercel will show the exact records. In the Route 53 hosted zone, typical values are:
   - **A** `brokedadsclub.com` → the IP Vercel displays (often `10.0.1.2`)
   - **CNAME** `www` → `cname.vercel-dns.com`
3. Wait for SSL. Apex and `www` should both serve this app.

Leave any leftover Amplify / S3 / placeholder records out of the way so the new A/CNAME can take over.

## Stay live without updates

You do not need to publish guides, push code, or log in for brokedadsclub.com to keep serving. Vercel keeps the last successful deploy online. Scheduled posts still go live on their `publishedAt` date from that deploy. SSL renews automatically.

What actually takes a site down is billing, DNS, or a paused backend, not a quiet content week.

| Keep this on | Why |
| --- | --- |
| Vercel project + GitHub connection | Serves the site. Hobby is enough. Do not delete the project. |
| Domain auto-renew in Route 53 / the registrar | Expired domains are the usual silent failure. |
| A card on file for AWS (domain + SES) and Vercel if you leave Hobby | Missed renewal or a failed invoice is what goes dark, not "no updates." |
| Supabase (if you use email/shop data) | Free projects can pause after inactivity. The daily keepalive pings it. |
| `CRON_SECRET` in Vercel | Lets the keepalive and Sunday recap run. |

### Built-in checks

- Public health: `https://brokedadsclub.com/api/health` (JSON; `HEAD` works for cheap pings).
- Daily Vercel cron (`/api/cron/keepalive`, 8:15 a.m. Central) pings this site, every URL in [`content/uptime-sites.json`](content/uptime-sites.json), and Supabase. If a check fails and SES is configured, it emails `dad@brokedadsclub.com`.
- GitHub Action [Uptime](.github/workflows/uptime.yml) hits the same watch list about every 30 minutes. Enable **Watching** on the repo (or Actions failure emails) so a red run reaches you even if you did not open the dashboard. GitHub can pause scheduled workflows after ~60 days with no commits, so do not treat this as the only alarm.

Add another website by appending a `{ "name", "url" }` row to [`content/uptime-sites.json`](content/uptime-sites.json) and pushing. Use that site's own `/api/health` if it has one, otherwise the homepage.

Optional extra: a free external ping (UptimeRobot, Better Stack, Cronitor) pointed at `/api/health`. That is independent of GitHub and Vercel, so you still get a text/email if both of those are having a bad day.

Content freshness is separate: the **Daily dad trend scan** Cursor automation keeps ideas coming. It does not keep the site online, and you do not need it for uptime.

## Email recap (Amazon SES)
- Verify `brokedadsclub.com` in AWS SES (DKIM + SPF). Request production access if you are still in the SES sandbox.
- Create an IAM user that can `ses:SendEmail` / `ses:SendRawEmail`.
- In Vercel, set `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `SES_FROM_EMAIL`, `CRON_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY`.
- Cron: Sundays at 9:00 a.m. Central (`0 14 * * 0` UTC, which is 9am CDT / 8am in deep winter). Sends even in quiet weeks, with a fallback guide plus printables.

## What to do next

### Content / mission (priority)
- Keep the weekly cadence in [`content/ideas.md`](content/ideas.md) / [`content/DRAFTS.md`](content/DRAFTS.md).
- Google Search Console: add `https://brokedadsclub.com` → URL prefix or domain property → submit `https://brokedadsclub.com/sitemap.xml`.
- Vercel → Analytics: enable Web Analytics + Speed Insights if the dashboard still prompts (code is already wired).
- **Custom events** (Vercel → Analytics → Events): the site tracks guide views, scroll depth (25/50/75/100%), topic filters, search, shares, email signups (with `source`), printable views/prints, and shop cart/checkout. Use these to see which guides get read and which CTAs convert before changing homepage order.

### Swag
- **Copy:** Printify's AI titles and descriptions never hit the shop as-is. The site rewrites them into Broke Dads Club voice (short, dry, no souvenir-shop captions). Hand-written overrides in `src/lib/products.ts` still win when we have them.
- **Price:** BDC charges one retail price per product (page and cart match). Club Pup is $19.99. New Printify items use that product's lowest Printify variant price unless we set an override.
- **Before you publish in Printify:** Variants → select all sizes/colors → set the same price. Then publish. The site refreshes about every 2 minutes.
- Keep a product unpublished (or not visible) in Printify until that price is set, or it will show up on brokedadsclub.com as soon as it is public.
- Printify's print cost is separate. The number you set is what dads pay. Make sure it covers the biggest size you offer.
- Orders go to Printify after Stripe checkout when `PRINTIFY_API_TOKEN` and `PRINTIFY_SHOP_ID` are set.

### Optional later
- Supabase Auth for a members area.
- More lead magnets after the grocery checklist loop is working.
