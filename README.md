# Broke Dads Club

eCommerce and content platform for [brokedadsclub.com](https://brokedadsclub.com).

Repo: [github.com/rickord3297/BrokeDadsClub](https://github.com/rickord3297/BrokeDadsClub)

- **Guides** live in `content/guides` as Markdown (edit in Git / Cursor).
- **Products, subscribers, and orders** live in Supabase when you connect it.
- **Checkout** is Stripe. Until keys are set, the shop still works locally with seed products.
- **Host** on Vercel. **DNS** stays in Route 53.

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

### Email recap (Amazon SES)
- Verify `brokedadsclub.com` in AWS SES (DKIM + SPF). Request production access if you are still in the SES sandbox.
- Create an IAM user that can `ses:SendEmail` / `ses:SendRawEmail`.
- In Vercel, set `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `SES_FROM_EMAIL`, `CRON_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY`.
- Cron: Sundays 14:00 UTC (`/api/cron/weekly-recap`). Skips the week if no new live guides.

## What to do next

### Content / mission (priority)
- Keep the weekly cadence in [`content/ideas.md`](content/ideas.md) / [`content/DRAFTS.md`](content/DRAFTS.md).
- Google Search Console: add `https://brokedadsclub.com` → URL prefix or domain property → submit `https://brokedadsclub.com/sitemap.xml`.
- Vercel → Analytics: enable Web Analytics + Speed Insights if the dashboard still prompts (code is already wired).

### Swag
- Shop only shows real product photos. Print files on a dark square (tees) stay hidden until Printify mockups replace them.
- Connect Printify now to generate on-garment mockups and map SKUs. Do not sell a tee until that mockup is the shop image.
- Order wiring already exists (`src/lib/printify.ts` + Stripe webhook). It stays dark until `PRINTIFY_API_TOKEN`, `PRINTIFY_SHOP_ID`, and Stripe keys are set.
- Add Stripe keys when ready to take real orders (`STRIPE_SECRET_KEY`, webhook secret, publishable key).

### Optional later
- Supabase Auth for a members area.
- More lead magnets after the grocery checklist loop is working.
