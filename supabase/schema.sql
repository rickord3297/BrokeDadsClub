-- Run this in the Supabase SQL editor.

create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  name text not null,
  description text not null,
  price_cents integer not null check (price_cents >= 0),
  category text not null,
  art text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  email text,
  amount_total integer not null default 0,
  currency text not null default 'usd',
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.subscribers enable row level security;
alter table public.orders enable row level security;

create policy "Public can read active products"
  on public.products for select
  using (active = true);

create policy "Anyone can subscribe"
  on public.subscribers for insert
  with check (true);

-- Orders are written by the Stripe webhook using the service role key.

insert into public.products (id, slug, name, description, price_cents, category, art, active)
values
  ('prod_club_tee', 'club-tee', 'Official Club Tee',
   'Soft cotton. Loud enough that another dad in the pickup line might nod at you. That''s the whole marketing plan.',
   2800, 'Apparel', 'tee', true),
  ('prod_hoodie', 'club-hoodie', 'School-Run Hoodie',
   'The one you live in from October to April. Heavy fleece, kangaroo pocket for snacks, and a wordmark that says you belong here.',
   4800, 'Apparel', 'hoodie', true),
  ('prod_cap', 'dad-cap', 'Low-Profile Dad Cap',
   'Covers a haircut you keep meaning to get. Unstructured crown. Adjustable. No neon. No excuses.',
   2400, 'Apparel', 'cap', true),
  ('prod_mug', 'broke-mug', 'Broke Doesn''t Mean Broken Mug',
   '12 oz of whatever is keeping you vertical. Dishwasher-safe because nobody in this house is hand-washing a mug at 6:40 a.m.',
   1600, 'Home', 'mug', true),
  ('prod_stickers', 'sticker-pack', 'Laptop / Water-Bottle Pack',
   'Five weatherproof stickers. Put them on the dented bottle, the work laptop, the minivan that still has goldfish in the seats.',
   800, 'Gear', 'sticker', true)
on conflict (id) do nothing;
