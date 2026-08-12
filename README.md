# Broke Dads Club

Content site + shop for [brokedadsclub.com](https://brokedadsclub.com).

- **Guides** live in `content/guides` as Markdown (edit in Git / Cursor).
- **Products, subscribers, and orders** live in Supabase when you connect it.
- **Checkout** is Stripe. Until keys are set, the shop still works locally with seed products.
- **Host** on Vercel. **DNS** stays in Route 53.

The site runs without Supabase or Stripe. Connect them when you are ready to take real orders and emails.

## Local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 1. GitHub

Create an empty GitHub repo, then from this folder:

```bash
git add .
git commit -m "Initial Broke Dads Club site"
git remote add origin git@github.com:YOUR_USER/BrokeDadsClub.git
git push -u origin main
```

## 2. Supabase

1. Create a project.
2. SQL editor → paste `supabase/schema.sql` → run.
3. Copy **Project URL** and **anon public** key into `.env.local` / Vercel.
4. Copy the **service role** key too (webhook writes orders; never expose it to the browser).

Until those env vars exist, the shop uses the built-in seed catalog.

## 3. Stripe

1. Create a Stripe account (test mode first).
2. Add `STRIPE_SECRET_KEY` (and optional publishable key).
3. After the site is on Vercel, add an endpoint:

   `https://brokedadsclub.com/api/webhooks/stripe`

   Event: `checkout.session.completed`. Paste the signing secret into `STRIPE_WEBHOOK_SECRET`.

Prices are created on the fly at checkout. You do not need Stripe product IDs for the first merch drop.

## 4. Vercel

1. Import the GitHub repo.
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

Leave any leftover Amplify / S3 / placeholder records out of the way so the new A/CNAME can take over. That is why the domain currently 503s — nothing healthy is answering yet.

## What to do next

- Replace seed merch with real photos (Supabase Storage or `/public`).
- Hook Printful / Printify when you want print-on-demand fulfillment.
- Add more guides as `.md` files in `content/guides`.
- Optional: Supabase Auth for a members area later.
