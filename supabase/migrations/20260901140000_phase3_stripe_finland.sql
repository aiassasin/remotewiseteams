-- Phase 3: Stripe money flow + Finnish invoice fields.

alter table public.freelancers
  add column if not exists stripe_account_id text,
  add column if not exists stripe_onboarded boolean not null default false;

alter table public.invoices
  add column if not exists invoice_date date,
  add column if not exists payment_terms text,
  add column if not exists vat_exempt boolean not null default false,
  add column if not exists vat_total numeric(12, 2) not null default 0,
  add column if not exists net_total numeric(12, 2) not null default 0,
  add column if not exists seller_business_id text,
  add column if not exists buyer_business_id text,
  add column if not exists payout_option text not null default 'standard',
  add column if not exists stripe_payment_intent_id text,
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_transfer_id text,
  add column if not exists paid_at timestamptz,
  add column if not exists payout_at timestamptz,
  add column if not exists processing_fee numeric(12, 2) not null default 0,
  add column if not exists company_pays numeric(12, 2) not null default 0,
  add column if not exists lightning_fee numeric(12, 2) not null default 0;

create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  freelancer_id uuid not null references public.freelancers (id) on delete cascade,
  amount numeric(12, 2) not null,
  currency text not null default 'EUR',
  speed text not null default 'standard',
  status text not null default 'processing',
  stripe_transfer_id text,
  created_at timestamptz not null default now()
);

alter table public.payouts enable row level security;

create policy payouts_member_read on public.payouts
  for select using (
    company_id in (select company_id from public.members where user_id = auth.uid())
    or freelancer_id in (select id from public.freelancers where user_id = auth.uid())
  );

create policy payouts_freelancer_insert on public.payouts
  for insert with check (
    freelancer_id in (select id from public.freelancers where user_id = auth.uid())
  );
